/**
 * I NEED… request form — RN port of components/RequestForm.tsx.
 * Submits straight to the Apps Script Web App (see api.ts) and reports the
 * result through the toast callback the host screen passes in.
 *
 * Layout: a fixed header, a scrollable field area, and a sticky submit footer
 * so the whole card stays within one viewfold. Because I NEED… now lives inside
 * the Field playground, an "Improvement" request animates in a contextual
 * dropdown of the exact existing item being improved.
 */
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import { createRequest } from "./api";
import { Button } from "./Button";
import { FieldGroup, Segmented, Select, TextAreaField, TextField } from "./fields";
import { targetMeta, targetOptionsFor } from "./targetOptions";
import { c, ts } from "./tokens";
import {
  CATEGORIES,
  DESCRIPTION_WORD_LIMIT,
  TYPES,
  assigneeFor,
  wordCount,
} from "./types";
import type { ToastItem } from "./Toast";

const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
// Sheet stores "Improvement needed"; the control shows the shorter label.
const typeOptions = TYPES.map((t) => ({
  value: t,
  label: t === "Improvement needed" ? "Improvement" : t,
}));

const pad = (n: number) => String(n).padStart(2, "0");

export function RequestForm({
  onToast,
  onSubmitted,
}: {
  onToast: (t: Omit<ToastItem, "id">) => void;
  onSubmitted: () => void;
}) {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("New");
  const [target, setTarget] = useState("");
  const [description, setDescription] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Contextual target dropdown shows when improving an existing item.
  const needsTarget = type === "Improvement needed" && Boolean(category);
  const meta = targetMeta(category);
  const targetOptions = targetOptionsFor(category);

  const words = wordCount(description);
  const overLimit = words > DESCRIPTION_WORD_LIMIT;
  const figmaValid =
    !figmaLink || /^https?:\/\/(www\.)?figma\.com\//i.test(figmaLink.trim());
  const valid =
    Boolean(category) &&
    Boolean(type) &&
    (!needsTarget || Boolean(target)) &&
    Boolean(description.trim()) &&
    !overLimit &&
    figmaValid;

  // Step numbers shift when the contextual field is present.
  let step = 2; // 01 Category, 02 Type already used
  const targetIndex = needsTarget ? pad(++step) : "";
  const descIndex = pad(++step);
  const figmaIndex = pad(++step);

  function pickCategory(next: string) {
    setCategory(next);
    setTarget(""); // options depend on category
  }
  function pickType(next: string) {
    setType(next);
    if (next !== "Improvement needed") setTarget("");
  }

  async function handleSubmit() {
    setTouched(true);
    if (!valid || submitting) return;

    setSubmitting(true);
    try {
      await createRequest({
        category,
        type,
        target: needsTarget ? target : "",
        description: description.trim(),
        figmaLink: figmaLink.trim(),
      });
      onToast({
        title: "Request logged",
        description: "Thanks — your request was added to the sheet.",
        tone: "success",
      });
      setCategory("");
      setType("New");
      setTarget("");
      setDescription("");
      setFigmaLink("");
      setTouched(false);
      onSubmitted();
    } catch (err) {
      onToast({
        title: "Couldn't submit",
        description:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const errStyle = [ts("Body_B11_Regular"), { color: c.error }];
  const hintStyle = [ts("Body_B11_Regular"), { color: c.textMuted }];

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* Fixed header */}
      <View style={{ paddingHorizontal: 32, paddingTop: 32, paddingBottom: 20, gap: 8 }}>
        <Text style={[ts("Heading_H32_Bold"), { color: c.textPrimary }]}>Make a request</Text>
        <Text style={[ts("Body_B16_Regular"), { color: c.textTertiary }]}>
          Takes under a minute
        </Text>
      </View>

      {/* Scrollable fields */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 01 Category — plain View: a layout transition here re-animates the
            whole row every time the auto-assign hint changes its height, which
            reads as a jumpy glitch. The contextual field below still animates. */}
        <View>
          <FieldGroup
            index="01"
            label="Category"
            hint={
              category ? (
                <Text style={hintStyle}>
                  Auto-assigned to{" "}
                  <Text style={{ color: c.action }}>{assigneeFor(category)}</Text>
                </Text>
              ) : touched && !category ? (
                <Text style={errStyle}>Pick a category.</Text>
              ) : undefined
            }
          >
            <Select
              value={category}
              onChange={pickCategory}
              options={categoryOptions}
              placeholder="Select a category"
              invalid={touched && !category}
            />
          </FieldGroup>
        </View>

        {/* 02 Type */}
        <View>
          <FieldGroup index="02" label="Type">
            <Segmented value={type} onChange={pickType} options={typeOptions} />
          </FieldGroup>
        </View>

        {/* Contextual target — fades in when improving an existing item. Only
            this field animates; sibling fields use plain Views, because
            reanimated's LinearTransition layout shifts leave stale transforms
            on RN-web (fields ended up overlapping). */}
        {needsTarget ? (
          <Animated.View
            entering={FadeInDown.duration(280)}
            exiting={FadeOutUp.duration(160)}
          >
            <FieldGroup
              index={targetIndex}
              label={meta.label}
              hint={
                touched && !target ? (
                  <Text style={errStyle}>Pick the item you're improving.</Text>
                ) : undefined
              }
            >
              <Select
                value={target}
                onChange={setTarget}
                options={targetOptions}
                placeholder={meta.placeholder}
                searchable={category === "Icon" || targetOptions.length > 12}
                invalid={touched && !target}
              />
            </FieldGroup>
          </Animated.View>
        ) : null}

        {/* Description */}
        <View>
          <FieldGroup
            index={descIndex}
            label="Description"
            hint={
              <View
                style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}
              >
                <Text
                  style={
                    touched && !description.trim()
                      ? errStyle
                      : overLimit
                        ? errStyle
                        : [ts("Body_B11_Regular"), { color: c.textMuted, opacity: 0 }]
                  }
                >
                  {touched && !description.trim()
                    ? "Tell us what you need."
                    : overLimit
                      ? `Keep it under ${DESCRIPTION_WORD_LIMIT} words.`
                      : "."}
                </Text>
                <Text
                  style={[ts("Body_B11_Regular"), { color: overLimit ? c.error : c.textMuted }]}
                >
                  {words}/{DESCRIPTION_WORD_LIMIT}
                </Text>
              </View>
            }
          >
            <TextAreaField
              value={description}
              onChange={setDescription}
              placeholder="Describe what do you need"
              invalid={(touched && !description.trim()) || overLimit}
            />
          </FieldGroup>
        </View>

        {/* Figma Link (optional) */}
        <View>
          <FieldGroup
            index={figmaIndex}
            label="Figma Link"
            optional
            hint={
              touched && !figmaValid ? (
                <Text style={errStyle}>Must be a figma.com URL.</Text>
              ) : undefined
            }
          >
            <TextField
              keyboardType="url"
              value={figmaLink}
              onChange={setFigmaLink}
              placeholder="https://figma.com/..."
              invalid={touched && !figmaValid}
            />
          </FieldGroup>
        </View>
      </ScrollView>

      {/* Sticky submit footer */}
      <View
        style={{
          paddingHorizontal: 32,
          paddingTop: 20,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: c.borderSubtle,
        }}
      >
        <Button variant="neutral" fullWidth disabled={submitting} onPress={handleSubmit}>
          {submitting ? "Submitting…" : "Submit Request"}
        </Button>
      </View>
    </View>
  );
}
