import { Badge } from "@/components/ui/badge";

export interface InformationItem {
  prefix?: string;
  title: string;
  description: string;
}

export interface InformationDisplayProps {
  badge?: string;
  description?: string;
  items: InformationItem[];
}

const InformationDisplay = ({
  badge,
  description,
  items,
}: InformationDisplayProps) => {
  return (
    <section>
      <div className="text-center">
        <Badge className="text-xs font-medium">{badge}</Badge>
        <p className="mt-2 font-medium text-muted-foreground">{description}</p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        {items.map((item, index) => (
          <div key={index} className="mb-6 flex gap-4">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
              {item.prefix ?? index + 1}
            </span>
            <div>
              <h3 className="text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { InformationDisplay };
