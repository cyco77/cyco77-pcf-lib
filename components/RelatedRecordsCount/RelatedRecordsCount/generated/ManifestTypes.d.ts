/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    colorMode: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3" | "4" | "5" | "6">;
    customColorHex: ComponentFramework.PropertyTypes.StringProperty;
    subtitleMode: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3">;
    subtitleText: ComponentFramework.PropertyTypes.StringProperty;
    showBackgroundColor: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    relatedRecords: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
}
