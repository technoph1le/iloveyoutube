import {
  SectionHeader,
  SectionSubtitle,
  SectionTitle,
} from "@/components/ui/section";
import { PAGES } from "@/data/pages";
import { PricingTable } from "@clerk/nextjs";

export default function Page() {
  const data = PAGES.pricing;

  return (
    <section>
      <div className="wrapper py-8 space-y-6">
        <SectionHeader>
          <SectionTitle>{data.title}</SectionTitle>
          <SectionSubtitle>{data.description}</SectionSubtitle>
        </SectionHeader>

        <div className="wrapper-sm">
          <PricingTable
            appearance={{
              elements: {
                pricingTableCard: "shadow-none! border!",
                pricingTableCardFee: "text-4xl!",
                pricingTableCardFeePeriod: "text-lg!",
                pricingTableCardFeaturesList: "pl-4!",
                pricingTableCardFeaturesListItemTitle: "text-base!",
                pricingTableCardHeader: "bg-card! border-0!",
                pricingTableCardFooter: "bg-card! border-0!",
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
