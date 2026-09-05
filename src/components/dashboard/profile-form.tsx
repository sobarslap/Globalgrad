"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentProfileSchema,
  type StudentProfileInput,
  type StudentProfileValues,
} from "@/lib/domain/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileFormProps {
  defaultValues?: Partial<StudentProfileInput>;
  onSubmit: (values: StudentProfileValues) => void;
}

const fieldWrap = "flex flex-col gap-1.5";
const errorText = "text-xs text-destructive";

export function ProfileForm({ defaultValues, onSubmit }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentProfileInput>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      targetLevel: "masters",
      targetField: "Computer Science",
      nationality: "Bangladesh",
      ...defaultValues,
    },
  });

  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-xl">Your academic profile</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill this in to generate your readiness score and matches. All fields
          take a few seconds.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit((v) =>
            onSubmit(v as unknown as StudentProfileValues)
          )}
          className="grid gap-x-6 gap-y-6 sm:grid-cols-2"
        >
          <div className={fieldWrap}>
            <Label htmlFor="cgpa">CGPA (4.0 scale)</Label>
            <Input id="cgpa" type="number" step="0.01" {...register("cgpa")} />
            {errors.cgpa && <span className={errorText}>{errors.cgpa.message}</span>}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="ielts">IELTS band</Label>
            <Input id="ielts" type="number" step="0.5" {...register("ielts")} />
            {errors.ielts && (
              <span className={errorText}>{errors.ielts.message}</span>
            )}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="researchPapers">Research papers</Label>
            <Input
              id="researchPapers"
              type="number"
              {...register("researchPapers")}
            />
            {errors.researchPapers && (
              <span className={errorText}>{errors.researchPapers.message}</span>
            )}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="workExperienceMonths">Experience (months)</Label>
            <Input
              id="workExperienceMonths"
              type="number"
              {...register("workExperienceMonths")}
            />
            {errors.workExperienceMonths && (
              <span className={errorText}>
                {errors.workExperienceMonths.message}
              </span>
            )}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="targetLevel">Target level</Label>
            <select
              id="targetLevel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("targetLevel")}
            >
              <option value="bachelors">Bachelor&apos;s</option>
              <option value="masters">Master&apos;s</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="targetField">Field of study</Label>
            <Input id="targetField" {...register("targetField")} />
            {errors.targetField && (
              <span className={errorText}>{errors.targetField.message}</span>
            )}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" {...register("nationality")} />
            {errors.nationality && (
              <span className={errorText}>{errors.nationality.message}</span>
            )}
          </div>

          <div className={fieldWrap}>
            <Label htmlFor="greTotal">GRE total (optional)</Label>
            <Input id="greTotal" type="number" {...register("greTotal")} />
            {errors.greTotal && (
              <span className={errorText}>{errors.greTotal.message}</span>
            )}
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              Analyze my profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
