
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageElement } from '@/components/admin/PageBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grip, Pencil, Save, Trash2, X } from 'lucide-react';

interface SortableElementProps {
  element: PageElement;
  updateContent: (id: string, content: string) => void;
  updateProps: (id: string, props: Record<string, any>) => void;
  deleteElement: (id: string) => void;
}

const SortableElement: React.FC<SortableElementProps> = ({ 
  element, 
  updateContent, 
  updateProps, 
  deleteElement 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);
  const [editProps, setEditProps] = useState({...element.props});

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    updateContent(element.id, editContent);
    updateProps(element.id, editProps);
    setIsEditing(false);
  };

  const renderElement = () => {
    switch (element.type) {
      case 'heading':
        return renderHeading();
      case 'paragraph':
        return renderParagraph();
      case 'image':
        return renderImage();
      case 'button':
        return renderButton();
      case 'divider':
        return <hr className="my-4 border-t border-gray-200" />;
      case 'spacer':
        return <div style={{ height: element.props?.height || '20px' }} className="bg-gray-50" />;
      default:
        return <div>Unknown element type</div>;
    }
  };

  const renderHeading = () => {
    const size = element.props?.size || 'h2';
    let className = '';
    
    switch (size) {
      case 'h1': className = 'text-4xl font-bold'; break;
      case 'h2': className = 'text-3xl font-bold'; break;
      case 'h3': className = 'text-2xl font-bold'; break;
      case 'h4': className = 'text-xl font-bold'; break;
      case 'h5': className = 'text-lg font-bold'; break;
      case 'h6': className = 'text-base font-bold'; break;
      default: className = 'text-3xl font-bold';
    }
    
    if (isEditing) {
      return (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full"
          />
          <div className="space-y-2">
            <Label htmlFor="heading-size">Heading Size</Label>
            <Select 
              value={editProps?.size || 'h2'} 
              onValueChange={(value) => setEditProps({...editProps, size: value})}
            >
              <SelectTrigger id="heading-size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Heading 1 (Largest)</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="h4">Heading 4</SelectItem>
                <SelectItem value="h5">Heading 5</SelectItem>
                <SelectItem value="h6">Heading 6 (Smallest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    return <div className={className}>{element.content}</div>;
  };

  const renderParagraph = () => {
    if (isEditing) {
      return (
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full min-h-[100px]"
        />
      );
    }
    
    return <p>{element.content}</p>;
  };

  const renderImage = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input
              id="image-alt"
              value={editProps?.alt || ''}
              onChange={(e) => setEditProps({...editProps, alt: e.target.value})}
              placeholder="Image description"
            />
          </div>
        </div>
      );
    }
    
    return (
      <img 
        src={element.content} 
        alt={element.props?.alt || ''} 
        className="max-w-full h-auto"
      />
    );
  };

  const renderButton = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="button-url">Button URL</Label>
            <Input
              id="button-url"
              value={editProps?.url || '#'}
              onChange={(e) => setEditProps({...editProps, url: e.target.value})}
              placeholder="https://example.com or #section-id"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="button-variant">Button Style</Label>
            <Select 
              value={editProps?.variant || 'default'} 
              onValueChange={(value) => setEditProps({...editProps, variant: value})}
            >
              <SelectTrigger id="button-variant">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    const variant = element.props?.variant || 'default';
    const btnClass = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    }[variant];
    
    return (
      <Button 
        variant={variant as any} 
        className="pointer-events-none"
      >
        {element.content}
      </Button>
    );
  };

  const renderEditControls = () => {
    if (isEditing) {
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex gap-1">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => {
            setEditContent(element.content);
            setEditProps({...element.props});
            setIsEditing(true);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => deleteElement(element.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Card className={`border ${isDragging ? 'border-primary' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div 
              {...listeners} 
              className="p-2 cursor-move flex items-center gap-2 text-muted-foreground text-sm"
            >
              <Grip className="h-4 w-4" />
              <span>{element.type.charAt(0).toUpperCase() + element.type.slice(1)}</span>
            </div>
            {renderEditControls()}
          </div>
          <div className="p-1">
            {renderElement()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableElement;
