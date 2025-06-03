'use client';

import { useActionState } from "react";
import { updateAbout } from "@/actions/about-actions";
import { TextEditor } from "./text-editor/TextEditor";

interface AboutAdminProps {
  title: string;
  content: string;
}

interface ActionResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  fieldData: {
    title: string;
    content: string;
  };
}

export const AboutAdmin = ({ title, content }: AboutAdminProps) => {
  const [data, action, isPending] = useActionState<ActionResponse | undefined, FormData>(
    (state: ActionResponse | undefined, formData: FormData) => updateAbout(formData),
    undefined
  );

  return (
    <div className="p-4">
      <form action={action} className="form-container">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Título de la página"
            defaultValue={data?.fieldData?.title || title}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Contenido</label>
          <textarea
            id="content"
            name="content"
            placeholder="Contenido de la página"
            defaultValue={data?.fieldData?.content || content}
            className="form-input"
            rows={10}
          />
        </div>

        {data?.message && <p className="form-success">{data.message}</p>}
        {data?.error && <p className="form-error">{data.error}</p>}
        
        <div className="form-action-buttons">
          <button 
            type="submit"
            className="form-action-button-primary"
            disabled={isPending}
          >
            {isPending ? "Procesando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Bio
        </label>

        <TextEditor 
          initialContent={data?.fieldData?.content}
        />
      </div>
    </div>
  );
};
