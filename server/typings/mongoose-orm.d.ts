namespace MongooseOrm {
  export interface CustomFieldType {
    ui?: {
      enumMap?: { [x: string]: string };
      type?:
        | "Seo"
        | "MediaPicker"
        | "RichText"
        | "Checkbox"
        | "Phone"
        | "Email"
        | "JSON";
      column?: {
        showOverflowTooltip?: boolean;
        hidden?: boolean;
        width?: string;
        isImage?: boolean;
        isImages?: boolean;
        [x: string]: any;
      };
      form?: {
        label?: string;
        col?:
          | number
          | {
              span?: number;
              xs?: number;
              sm?: number;
              md?: number;
              lg?: number;
            };
        input?: {
          placeholder?: string;
          [x: string]: any;
        };
      };
    };
  }
}
