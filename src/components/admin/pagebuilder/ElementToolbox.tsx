
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ElementType } from '@/components/admin/PageBuilder';
import { 
  Type, 
  AlignLeft, 
  Image as ImageIcon, 
  Square,
  SplitSquareVertical,
  MoveVertical
} from 'lucide-react';

interface ElementToolboxProps {
  onAddElement: (type: ElementType) => void;
}

const ElementToolbox: React.FC<ElementToolboxProps> = ({ onAddElement }) => {
  const elements = [
    { type: 'heading', icon: Type, label: 'Heading' },
    { type: 'paragraph', icon: AlignLeft, label: 'Paragraph' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'button', icon: Square, label: 'Button' },
    { type: 'divider', icon: SplitSquareVertical, label: 'Divider' },
    { type: 'spacer', icon: MoveVertical, label: 'Spacer' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {elements.map((element) => (
            <Button
              key={element.type}
              variant="outline"
              className="justify-start"
              onClick={() => onAddElement(element.type as ElementType)}
            >
              <element.icon className="mr-2 h-4 w-4" />
              <span>{element.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementToolbox;
