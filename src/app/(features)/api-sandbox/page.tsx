import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { FEATURES } from "@/data/features";
import ApiCodeSnippet from "@/features/api-sandbox/components/api-code-snippet";
import ApiEndpointSelector from "@/features/api-sandbox/components/api-endpoint-selector";
import ApiInputPanel from "@/features/api-sandbox/components/api-input-panel";
import ApiResponsePreview from "@/features/api-sandbox/components/api-response-preview";

export default function Page() {
  const sectionInfo = FEATURES["apiSandbox"];

  return (
    <>
      <section>
        <div className="wrapper py-8">
          <SectionHeader>
            <SectionTitle>{sectionInfo.title}</SectionTitle>
            <SectionSubtitle>{sectionInfo.description}</SectionSubtitle>
          </SectionHeader>
        </div>
      </section>
      <section>
        <div className="wrapper relative">
          <SidebarProvider
            style={
              {
                "--sidebar-width": "20rem",
                "--sidebar-width-mobile": "20rem",
              } as Record<string, string>
            }
          >
            <Sidebar variant="floating">
              <ApiEndpointSelector />
            </Sidebar>
            <div className="grid gap-4 p-2 w-full">
              <ApiInputPanel />
              <ApiResponsePreview />
              <ApiCodeSnippet />
            </div>
          </SidebarProvider>
        </div>
      </section>
    </>
  );
}
