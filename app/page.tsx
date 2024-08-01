"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {
  Card,
  Heading,
  Flex,
  Label,
  Input,
  SelectField,
  TextAreaField,
  Loader,
  Accordion,
  Text,
} from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  type Question = {
    id: number;
    text: string;
  };

  type Answers = {
    [key: number]: string;
  };
  const [answers, setAnswers] = useState<Answers>({});
  const noOfQuestions = 6; //no of questions the llm should return
  const [role, setRole] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const sampleQuestions = {
    questions: [
      {
        id: 1,
        text: "現在の専門知識のレベルはどの程度ですか?",
      },
      {
        id: 2,
        text: "観客の前で発表することに、どの程度慣れていますか?",
      },
    ],
  };

  const [learningPlans, setLearningPlans] = useState<
    Array<Schema["LearningPlan"]["type"]>
  >([]);

  const listLearningPlans = () => {
    client.models.LearningPlan.observeQuery().subscribe({
      next: (data) => setLearningPlans([...data.items]),
    });
  };

  useEffect(() => {
    listLearningPlans();
  }, []);

  const fetchQuestions = async (e: any) => {
    setLoading(true);
    setLevel(level);
    const questionString = JSON.stringify(sampleQuestions);
    const prompt = `
    より関連性の高い学習計画を作成できるよう、
    ${level} ${role}のユーザーに質問できる質問を${noOfQuestions}件教えてください。
    この質問への回答は、学習計画を生成するためのLLMに入力されます。
    以下の形式で質問を返してください:
    ${questionString}`;
    const response = await askBedrock(prompt);
    const content = JSON.parse(response);
    const generatedQuestions = content["questions"] ?? [];
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const askBedrock = async (prompt: string) => {
    const response = await client.queries.askBedrock({ prompt: prompt });
    const res = JSON.parse(response.data?.body!);
    const content = res.content[0].text;
    return content || null;
  };

  const generatePlan = async (event: any) => {
    setLoading(true);
    let answersString = `次の質問と回答を踏まえて、学習計画を作成してください。 ${level} ${role}:`;
    for (const [questionId, answer] of Object.entries(answers)) {
      let question = questions.find((q) => q.id === parseInt(questionId));
      if (!question) continue;
      answersString += `\nQuestion: ${question.text}; answer: ${answer}`;
    }

    const response = await askBedrock(answersString);
    setGeneratedPlan(response);
    setPlan(response);
    setLoading(false);
  };

  const handleModifiedPlan = (event: any) => {
    setPlan(event.target.value);
  };

  const createLearningPlan = async () => {
    setLoading(true);
    const createdPlan = await client.models.LearningPlan.create({
      role: role,
      level: level,
      plan: plan,
      status: "initial",
    });

    setLoading(false);
    return createdPlan;
  };

  const handleRoleChange = (role: string) => {
    setRole(role);
  };

  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const deleteLearningPlan = async (id: string) => {
    setLoading(true);
    await client.models.LearningPlan.delete({ id });
    listLearningPlans();
    setLoading(false);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <div>
            <Card>
              <Heading level={3}>学習計画を作成する</Heading>
              <Heading level={5}>
                次の書式に従って学習プランを作成してください。
              </Heading>
              <Flex direction="column" gap="small">
                <SelectField
                  label="職種"
                  options={[
                    "",
                    "クラウドアーキテクト",
                    "ソフトウェアエンジニア",
                    "プロダクトデザイナー",
                  ]}
                  placeholder="職種を選択してください"
                  onChange={(event) => handleRoleChange(event.target.value)}
                ></SelectField>

                <SelectField
                  label="レベル"
                  options={["", "初級", "中級", "プロ"]}
                  placeholder="レベルを選択してください"
                  onChange={(event) => fetchQuestions(event.target.value)}
                ></SelectField>

                {questions.map((question) => (
                  <div key={question.id}>
                    <Label>{question.text}</Label>
                    <Input
                      onBlur={(event) =>
                        handleInputChange(question.id, event.target.value)
                      }
                    />
                  </div>
                ))}
              </Flex>
              <Loader display={loading ? "block" : "none"} variation="linear" />
              <Flex direction="column" margin="large">
                <button onClick={generatePlan}>送信</button>
              </Flex>
              <div hidden={!generatedPlan}>
                <Heading level={5}>生成された計画</Heading>
                <Flex direction="column" gap="medium">
                  <TextAreaField
                    label=""
                    defaultValue={generatedPlan}
                    rows={30}
                    onChange={(event) => handleModifiedPlan(event.target.value)}
                  ></TextAreaField>
                  <button onClick={createLearningPlan}>保存</button>
                </Flex>
              </div>
            </Card>
          </div>
          <h1>私の学習プラン一覧</h1>
          <Accordion.Container>
            {learningPlans.map((learningPlan) => (
              <Accordion.Item value={learningPlan.id}>
                <Accordion.Trigger>
                  {learningPlan.role}
                  <Accordion.Icon />
                </Accordion.Trigger>
                <Accordion.Content>
                  <Flex direction="column" gap="medium">
                    <TextAreaField
                      label=""
                      defaultValue={learningPlan.plan}
                      rows={30}
                      isReadOnly={true}
                      // onChange={(event) => handleModifiedPlan(event.target.value)}
                    ></TextAreaField>
                    <button onClick={() => deleteLearningPlan(learningPlan.id)}>
                      削除
                    </button>
                    <Loader
                      display={loading ? "block" : "none"}
                      variation="linear"
                    />
                  </Flex>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Container>
        </main>
      )}
    </Authenticator>
  );
}
