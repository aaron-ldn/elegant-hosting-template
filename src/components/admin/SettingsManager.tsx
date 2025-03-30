
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import DatabaseService from "@/services/DatabaseService";

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    site_name: '',
    site_url: '',
    contact_email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsFetching(true);
    try {
      const dbService = DatabaseService.getInstance();
      const result = await dbService.getSettings();
      
      if (result.success && result.data) {
        setSettings({
          site_name: result.data.site_name || 'CloudHost',
          site_url: result.data.site_url || 'https://cloudhost.com',
          contact_email: result.data.contact_email || 'info@cloudhost.com'
        });
      } else {
        toast({
          title: "Failed to load settings",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load website settings",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [id.replace('setting-', '')]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const dbService = DatabaseService.getInstance();
      const result = await dbService.updateSettings(settings);
      
      if (result.success) {
        toast({
          title: "Settings updated",
          description: "Your settings have been saved successfully",
        });
      } else {
        toast({
          title: "Failed to save settings",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save website settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Settings</CardTitle>
        <CardDescription>
          Configure your website settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="setting-site_name">Site Name</Label>
          <Input 
            id="setting-site_name" 
            value={settings.site_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="setting-site_url">Site URL</Label>
          <Input 
            id="setting-site_url" 
            value={settings.site_url}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="setting-contact_email">Contact Email</Label>
          <Input 
            id="setting-contact_email" 
            type="email"
            value={settings.contact_email}
            onChange={handleInputChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsManager;
