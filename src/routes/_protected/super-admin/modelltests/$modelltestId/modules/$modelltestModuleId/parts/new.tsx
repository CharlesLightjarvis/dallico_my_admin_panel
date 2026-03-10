import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModelltest } from "../../../../../../../../../hooks/use-modelltests";
import { useCreatePart } from "../../../../../../../../../hooks/use-parts";
import { PartForm } from "../../../../../-components/forms/PartForm";
import { createPartDefaultValues } from "../../../../../../../../../schemas/part-schema";

export const Route = createFileRoute(
  "/_protected/super-admin/modelltests/$modelltestId/modules/$modelltestModuleId/parts/new"
)({
  component: CreatePartPage,
});

function CreatePartPage() {
  const { modelltestId, modelltestModuleId } = Route.useParams();
  const navigate = useNavigate();
  const { data: modelltest } = useModelltest(modelltestId);
  const createPart = useCreatePart();

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

  return (
    <div className="container space-y-6 p-4 max-w-6xl">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goToList}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Créer une nouvelle partie
          </h1>
        </div>
        <p className="text-muted-foreground">
          {modelltest && modelltestModule
            ? `${modelltest.title} — ${modelltestModule.module.name}`
            : "Rédigez le contenu en Markdown."}
        </p>
      </div>
      <PartForm
        defaultValues={{
          ...createPartDefaultValues,
          modelltest_module_id: modelltestModuleId,
        }}
        onSubmit={async (data, _questions, _partChoices) => {
          return createPart.mutateAsync(data);
        }}
        isPending={createPart.isPending}
        submitLabel="Créer la partie"
        pendingLabel="Création..."
        lockedModule={lockedModule}
        onBack={goToList}
        onSuccess={goToListReplace}
      />
    </div>
  );
}
