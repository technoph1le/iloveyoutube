import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { FEATURES } from "@/data/features";

export default function Features() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Object.entries(FEATURES).map(([key, { icon: Icon, ...feature }]) => (
        <li key={key}>
          <Link href={feature.link}>
            <Card className="hover:outline-1 h-full">
              <CardContent className="space-y-4">
                <Icon size={42} />
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {feature.title}
                  {feature.published ? (
                    <Badge variant="outline">New</Badge>
                  ) : null}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
