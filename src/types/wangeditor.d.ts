// src/types/wangeditor.d.ts
declare module "@wangeditor/editor-for-vue" {
  import { Component, Ref } from "vue";

  export interface InsertFnType {
    (url: string, alt?: string, href?: string): void;
  }

  export interface ToolbarProps {
    editor: any;
    defaultConfig: Record<string, any>;
    mode: string;
  }

  export interface EditorProps {
    modelValue: string;
    defaultConfig: Record<string, any>;
    mode: string;
  }

  export const Toolbar: Component<ToolbarProps>;
  export const Editor: Component<
    EditorProps & {
      "onUpdate:modelValue"?: (value: string) => void;
      onCreated?: (editor: any) => void;
    }
  >;
}
