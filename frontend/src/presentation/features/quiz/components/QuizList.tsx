import type { Quiz } from "../../../../domain/types/quiz";
import type { QuizProgress } from "../../../../domain/types/quiz";
import { Card, Button, EmptyState, Icon } from "../../../design-system";
import { Brain, Play } from "lucide-react";

export function QuizList(props: {
  quizzes: Quiz[];
  getProgress: (quizId: string) => QuizProgress | null;
  onStart: (quiz: Quiz) => void;
}) {
  return (
    <Card variant="panel" className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-meta font-semibold text-text1">
          <Icon icon={Brain} />
          <span>Quizzes</span>
        </div>
        <div className="text-meta text-text1">{props.quizzes.length}</div>
      </div>

      {props.quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet."
          description="Add JSON files under course/&lt;module&gt;/quiz/ and regenerate the catalog."
        />
      ) : (
        <ul className="m-0 grid gap-3 p-0">
          {props.quizzes.map((quiz) => {
            const progress = props.getProgress(quiz.id);
            return (
              <li key={quiz.id} className="list-none">
                <div className="flex flex-col gap-3 rounded-panel border border-border0 bg-surfacePanel p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-body font-semibold text-text0">{quiz.title}</div>
                    {quiz.description ? (
                      <p className="m-0 mt-1 text-meta text-text1">{quiz.description}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-meta text-text1">
                      <span>{quiz.questions.length} questions</span>
                      {progress ? (
                        <span>
                          Best: {progress.bestScore}/{progress.bestTotal}
                          {progress.attempts > 1 ? ` · ${progress.attempts} attempts` : ""}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Button variant="secondary" size="md" onClick={() => props.onStart(quiz)}>
                    <Icon icon={Play} />
                    Start
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
