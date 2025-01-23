import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, X, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

const SearchRanker = () => {
  // Sample initial data
  const [items, setItems] = useState([
    {
      id: 1,
      name: "React Hooks",
      text: "Understanding React Hooks and their usage",
      tags: ["react", "javascript", "frontend"],
    },
    {
      id: 2,
      name: "TypeScript Basics",
      text: "Introduction to TypeScript fundamentals",
      tags: ["typescript", "javascript"],
    },
    {
      id: 3,
      name: "CSS Grid",
      text: "Modern layout with CSS Grid",
      tags: ["css", "frontend"],
    },
  ]);

  // Search priorities
  const [priorities, setPriorities] = useState([
    { id: "exact-name", label: "Exact name match", weight: 1.0 },
    { id: "partial-name", label: "Partial name match", weight: 0.7 },
    { id: "tag-match", label: "Tag match", weight: 0.5 },
    { id: "text-match", label: "Text content match", weight: 0.3 },
  ]);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    text: "",
    tags: "",
  });
  const [results, setResults] = useState<
    Array<(typeof items)[0] & { score: number }>
  >([]);

  // Add new state for tracking drop target

  // Add useEffect import at the top if not already present
  useEffect(() => {
    // Move search logic here
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const scoredResults = items.map((item) => {
      let score = 0;
      const query = searchQuery.toLowerCase();

      // Apply each priority with its weight
      priorities.forEach((priority, index) => {
        const weight = 1 - index * 0.2; // Decreasing weight based on priority order

        switch (priority.id) {
          case "exact-name":
            if (item.name.toLowerCase() === query) {
              score += weight * 10;
            }
            break;
          case "partial-name":
            if (item.name.toLowerCase().includes(query)) {
              score += weight * 5;
            }
            break;
          case "tag-match":
            if (item.tags.some((tag) => tag.toLowerCase().includes(query))) {
              score += weight * 3;
            }
            break;
          case "text-match":
            if (item.text.toLowerCase().includes(query)) {
              score += weight * 2;
            }
            break;
        }
      });

      return { ...item, score };
    });

    const filteredResults = scoredResults
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    setResults(filteredResults);
  }, [searchQuery, items, priorities]); // Dependencies for the effect

  // Update DndContext to include onDragOver and reset activeDropId when drag ends
  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;
    const { active, over } = event;

    if (active.id !== over.id) {
      setPriorities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Handle adding new items
  const handleAddItem = () => {
    if (newItem.name && newItem.text) {
      const id =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      setItems([
        ...items,
        {
          ...newItem,
          id,
          tags: newItem.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        },
      ]);
      setNewItem({ id: "", name: "", text: "", tags: "" });
    }
  };

  return (
    <div className="w-full flex gap-4 p-4">
      <div className="flex-1 flex flex-col gap-4">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />

            {results.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Results</h3>
                <div className="space-y-2">
                  {results.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.text}</p>
                          <div className="flex gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline">
                          Score: {item.score.toFixed(2)}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Priorities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <DndContext
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={priorities.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {priorities.map((priority) => (
                    <React.Fragment key={priority.id}>
                      <SortableItem id={priority.id}>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <GripVertical className="text-gray-400" size={20} />
                          <span className="flex-1">{priority.label}</span>
                          <Badge variant="secondary">
                            Weight:{" "}
                            {priorities.findIndex((p) => p.id === priority.id) *
                              0.2}
                          </Badge>
                        </div>
                      </SortableItem>
                    </React.Fragment>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        {/* Database Section */}
        <Card>
          <CardHeader>
            <CardTitle>Item Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add new item form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Text description"
                  value={newItem.text}
                  onChange={(e) =>
                    setNewItem({ ...newItem, text: e.target.value })
                  }
                />
                <Input
                  placeholder="Tags (comma-separated)"
                  value={newItem.tags}
                  onChange={(e) =>
                    setNewItem({ ...newItem, tags: e.target.value })
                  }
                />
                <Button onClick={handleAddItem}>
                  <Plus size={20} />
                </Button>
              </div>

              {/* Items table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.text}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setItems(items.filter((i) => i.id !== item.id))
                          }
                        >
                          <X size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchRanker;
