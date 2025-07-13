"use client";

import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import leagueCategories from "@/data/jsons/league_categories.json";
import { RichTextField } from "@/components/RichTextEditor";

interface CategoryForCreation {
  category_name: string;
  category_format: string;
  max_team: number;
  entrance_fee_amount: number;
}

type Props = {
  field: {
    value: CategoryForCreation[];
    onChange: (value: CategoryForCreation[]) => void;
  };
  error?: string;
};

export function LeagueCategorySelector({ field, error }: Props) {
  const [open, setOpen] = useState(false);
  const selected = field.value || [];

  const isAlreadySelected = (name: string) =>
    selected.some((c) => c.category_name === name);

  const addCategory = (name: string) => {
    if (!isAlreadySelected(name)) {
      const newCategory: CategoryForCreation = {
        category_name: name,
        category_format: "",
        max_team: 0,
        entrance_fee_amount: 0,
      };
      field.onChange([...selected, newCategory]);
    }
  };

  const removeCategory = (name: string) => {
    field.onChange(selected.filter((c) => c.category_name !== name));
  };

  const updateCategory = (name: string, updatedFields: Partial<CategoryForCreation>) => {
    field.onChange(
      selected.map((category) =>
        category.category_name === name
          ? { ...category, ...updatedFields }
          : category
      )
    );
  };

  return (
    <FormItem className="flex flex-col gap-4">
      <FormLabel>League Categories</FormLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              Select categories
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-72 overflow-y-auto">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {leagueCategories.map((category: string) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => {
                    addCategory(category);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isAlreadySelected(category) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.map((category) => (
        <Card key={category.category_name} className="p-2 rounded-md">
          <CardHeader className="p-0 flex flex-row justify-between items-center">
            <CardTitle>{category.category_name}</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeCategory(category.category_name)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            <div className="space-y-1">
              <FormLabel>Category Format</FormLabel>
              <RichTextField
                value={category.category_format}
                onChange={(val) =>
                  updateCategory(category.category_name, {
                    category_format: val,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel>Maximum Teams</FormLabel>
                <Input
                  required
                  type="number"
                  min={1}
                  placeholder="Max teams"
                  onChange={(e) =>
                    updateCategory(category.category_name, {
                      max_team: parseInt(e.target.value || "0", 10),
                    })
                  }
                />
              </div>

              <div className="space-y-1">
                <FormLabel>Entrance Fee (₱)</FormLabel>
                <Input
                  required
                  type="number"
                  min={0}
                  placeholder="Entrance fee"
                  onChange={(e) =>
                    updateCategory(category.category_name, {
                      entrance_fee_amount: parseFloat(e.target.value || "0"),
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
