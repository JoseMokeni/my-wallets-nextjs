import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, Key, User, Shield } from "lucide-react";
import { prisma } from "@/prisma";
import ChangePasswordForm from "./change-password-form";

async function getUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
    },
  });
  return user;
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userDetails = await getUserDetails(session.user.id!);

  if (!userDetails) {
    redirect("/login");
  }

  const hasPassword = !!userDetails.password;
  const isOAuthUser = userDetails.accounts.length > 0;
  const providers = userDetails.accounts.map((account) => account.provider);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <p className="text-muted-foreground mb-6">
        Manage your account information and security settings
      </p>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userDetails.image || ""}
                  alt={userDetails.name || "User"}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(userDetails.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">
                  {userDetails.name || "Unnamed User"}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {userDetails.email}
                </div>
                {userDetails.emailVerified && (
                  <Badge variant="secondary" className="w-fit">
                    <Shield className="h-3 w-3 mr-1" />
                    Email Verified
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-muted-foreground">
                  {formatDate(userDetails.createdAt)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Key className="h-4 w-4" />
                  Authentication Methods
                </div>
                <div className="flex flex-wrap gap-2">
                  {hasPassword && <Badge variant="outline">Credentials</Badge>}
                  {providers.map((provider) => (
                    <Badge
                      key={provider}
                      variant="outline"
                      className="capitalize"
                    >
                      {provider}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        {hasPassword && !isOAuthUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
