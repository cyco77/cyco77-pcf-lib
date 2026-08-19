/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    chartType: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1" | "2" | "3" | "4">;
    groupByField: ComponentFramework.PropertyTypes.StringProperty;
    aggregationMode: ComponentFramework.PropertyTypes.EnumProperty<"0" | "1">;
    valueField: ComponentFramework.PropertyTypes.StringProperty;
    showDataNextToChart: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    chartData: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
}
