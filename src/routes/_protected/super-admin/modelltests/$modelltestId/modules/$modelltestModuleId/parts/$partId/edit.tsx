import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModelltest } from "../../../../../../../../../../hooks/use-modelltests";
import {
  usePart,
  useUpdatePart,
} from "../../../../../../../../../../hooks/use-parts";
import { PartForm } from "../../../../../../-components/forms/PartForm";
import type { QuestionDraft } from "../../../../../../../../../../types/question";
import type { PartChoiceDraft } from "../../../../../../../../../../types/part";

export const Route = createFileRoute(
  "/_protected/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts/$partId/edit"
)({
  component: EditPartPage,
});

function EditPartPage() {
  const { modelltestId, modelltestModuleId, partId } = Route.useParams();
  const navigate = useNavigate();
  const { data: modelltest } = useModelltest(modelltestId);
  const { data: part, isLoading } = usePart(partId);
  const updatePart = useUpdatePart();

  const modelltestModule = modelltest?.modelltest_modules.find(
    (mm) => mm.id === modelltestModuleId
  );

  const goToList = () =>
    navigate({
      to: "/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts",
      params: { modelltestId, modelltestModuleId },
    });

  const goToListReplace = () =>
    navigate({
      to: "/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts",
      params: { modelltestId, modelltestModuleId },
      replace: true,
    });

  const lockedModule =
    modelltest && modelltestModule
      ? {
          id: modelltestModuleId,
          modelltestTitle: modelltest.title,
          moduleName: modelltestModule.module.name,
        }
      : undefined;

  // Mapper questions du back → QuestionDraft
  const initialQuestions: QuestionDraft[] = (part?.questions ?? []).map(
    (q) => ({
      id: q.id,
      order: q.order,
      content: q.content,
      gap_number: q.gap_number,
      image_url: q.image_url,
      audio_url: q.audio_url,
      points: q.points,
      sub_type: q.sub_type,
      correct_answer: q.correct_answer,
      removed_choice_ids: [],
      choices: (q.choices ?? []).map((c) => ({
        id: c.id,
        label: c.label,
        text: c.text ?? "",
        image_url: c.image_url,
        is_correct: c.is_correct,
        order: c.order,
      })),
    })
  );

  // Mapper part-level choices (ZUORDNUNG annonces, DRAG_DROP_MOT liste)
  // ce sont les choices sans question_id
  const initialPartChoices: PartChoiceDraft[] = (part?.choices ?? [])
    .filter((c) => c.question_id === null)
    .map((c) => ({
      id: c.id,
      label: c.label,
      text: c.text ?? "",
      image_url: c.image_url,
      is_correct: c.is_correct,
      order: c.order,
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-destructive">Partie introuvable.</p>
      </div>
    );
  }

  return (
    <div className="container space-y-6 p-4 max-w-6xl">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goToList}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier la partie
          </h1>
        </div>
        <p className="text-muted-foreground">
          {modelltest && modelltestModule
            ? `${modelltest.title} — ${modelltestModule.module.name}`
            : "Modifier le contenu de la partie."}
        </p>
      </div>
      <PartForm
        defaultValues={{
          modelltest_module_id: part.modelltest_module_id,
          order: part.order,
          label: part.label,
          question_type: part.question_type,
          instructions: part.instructions,
          context_text: part.context_text,
        }}
        initialQuestions={initialQuestions}
        initialPartChoices={initialPartChoices}
        onSubmit={async (data, _questions, _partChoices) => {
          return updatePart.mutateAsync({ id: partId, ...data });
        }}
        isPending={updatePart.isPending}
        submitLabel="Mettre à jour"
        pendingLabel="Sauvegarde..."
        lockedModule={lockedModule}
        onBack={goToList}
        onSuccess={goToListReplace}
      />
    </div>
  );
}
