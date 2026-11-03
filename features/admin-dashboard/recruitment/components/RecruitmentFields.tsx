"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FieldType } from "@prisma/client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import FieldModal from "../../shared/components/FieldModal";
import Popup from "../../shared/components/Popup";

interface Props {
  id: string;
  title?: string;
  emptyMessage?: string;
}

interface RecruitmentFormField {
  id: string;
  recruitmentId: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string | null;
  order: number | null;
}

interface FieldValues {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
}

export default function RecruitmentFields({
  id,
  title = "Application Form",
  emptyMessage = "No application fields yet. Add one to start building the form.",
}: Props) {
  const [fields, setFields] = useState<RecruitmentFormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<RecruitmentFormField | null>(
    null
  );

  const [isSaving, setIsSaving] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    type: "success" as const,
    message: "",
    isConfirm: false,
    onConfirm: () => {},
  });

  const fetchFields = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`/api/recruitment/${id}`);

      setFields(data.drive.formFields ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingField(null);
    setShowModal(true);
  };

  const openEdit = (field: RecruitmentFormField) => {
    setEditingField(field);
    setShowModal(true);
  };

  const saveField = async (values: FieldValues) => {
    setIsSaving(true);

    try {
      if (editingField) {
        await axios.patch(
          `/api/recruitment/${id}/form-fields/${editingField.id}`,
          values
        );
      } else {
        await axios.post(`/api/recruitment/${id}/form-fields`, {
          ...values,
          order: fields.length,
        });
      }

      await fetchFields();

      setShowModal(false);
      setEditingField(null);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to save this field.",
        isConfirm: false,
        onConfirm: () => {},
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteField = async (field: RecruitmentFormField) => {
    try {
      await axios.delete(`/api/recruitment/${id}/form-fields/${field.id}`);
      await fetchFields();
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        type: "success",
        message: "Unable to delete this field.",
        isConfirm: false,
        onConfirm: () => {},
      });
    }
  };

  const confirmDelete = (field: RecruitmentFormField) => {
    setPopup({
      show: true,
      type: "success",
      message: `Delete field "${field.label}"?`,
      isConfirm: true,
      onConfirm: () => {
        deleteField(field);
        setPopup((p) => ({ ...p, show: false }));
      },
    });
  };

  useEffect(() => {
    fetchFields();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black"
        >
          {" "}
          <Plus className="h-4 w-4" />
          Add Field
        </button>
      </div>

      <div className="space-y-3">
        {fields.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-neutral-500">
            {emptyMessage}
          </p>
        )}

        {fields.map((field) => (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111] p-5"
          >
            <div>
              <h3 className="font-semibold text-white">{field.label}</h3>

              <p className="text-sm text-neutral-500">{field.type}</p>

              {field.required && (
                <span className="mt-2 inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
                  Required
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(field)}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <Pencil className="h-4 w-4 text-white" />
              </button>

              <button
                onClick={() => confirmDelete(field)}
                className="rounded-lg p-2 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <FieldModal
        open={showModal}
        loading={isSaving}
        initialValues={
          editingField
            ? {
                name: editingField.name,
                label: editingField.label,
                type: editingField.type,
                required: editingField.required,
                placeholder: editingField.placeholder ?? "",
              }
            : undefined
        }
        onClose={() => {
          setShowModal(false);
          setEditingField(null);
        }}
        onSubmit={saveField}
      />

      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        isConfirm={popup.isConfirm}
        onConfirm={popup.onConfirm}
        onClose={() => setPopup((p) => ({ ...p, show: false }))}
      />
    </div>
  );
}
