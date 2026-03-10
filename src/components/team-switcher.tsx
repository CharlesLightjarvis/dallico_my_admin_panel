import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import logo from "../../assets/dallico.png";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="px-2 py-2 overflow-hidden">
          <img
            src={logo}
            alt="Dallico"
            className="w-full max-h-[50px] object-cover [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]"
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
