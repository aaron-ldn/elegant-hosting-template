
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminLink = () => {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/admin" className="flex items-center gap-1">
        <Shield className="h-4 w-4" />
        <span>Admin</span>
      </Link>
    </Button>
  );
};

export default AdminLink;
