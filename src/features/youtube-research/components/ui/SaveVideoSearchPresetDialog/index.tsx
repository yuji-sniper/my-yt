"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const presetNameSchema = z.object({
  name: z.string().min(1).max(100)
})

type PresetNameFormValues = z.infer<typeof presetNameSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
  isSaving: boolean
}

export function SaveVideoSearchPresetDialog({
  open,
  onOpenChange,
  onSave,
  isSaving
}: Props) {
  const t = useTranslations("youtubeResearch.preset")

  const form = useForm<PresetNameFormValues>({
    resolver: zodResolver(presetNameSchema),
    defaultValues: { name: "" }
  })

  const handleSubmit = (values: PresetNameFormValues) => {
    onSave(values.name)
    form.reset()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("saveTitle")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : (
                  t("saveButton")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
