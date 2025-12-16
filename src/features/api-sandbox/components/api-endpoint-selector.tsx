import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ENDPOINT_OPTIONS } from "../data/endpoint-options";

export default function ApiEndpointSelector() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {ENDPOINT_OPTIONS.map(({ icon: Icon, ...option }, index) => (
            <Collapsible
              key={option.label}
              className="group/collapsible"
              defaultOpen={index === 0} // only default open the first item
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="h-auto py-2 px-4">
                    <Icon />
                    <span className="text-base">{option.label}</span>
                    <PlusIcon className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <MinusIcon className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {option.items.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {option.items.map((item) => (
                        <SidebarMenuSubItem key={item.key}>
                          <SidebarMenuSubButton
                            isActive={item.key === "getVideoDetails"}
                            className="h-auto py-1 px-3 text-base cursor-pointer"
                          >
                            {item.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
