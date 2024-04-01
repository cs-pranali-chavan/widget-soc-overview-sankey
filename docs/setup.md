| [Home](../README.md) |
| -------------------- |

# Installation

1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appear, search for and select **SOC Overview Sankey**.
3. Click the **SOC Overview Sankey** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

A Sankey chart can be rendered using static or live data and the configuration of the chart depends on the selected type of data source 
## Data Source Selection

| Fields      | Description                              |
| ----------- | ---------------------------------------- |
| Title       | Specify a title for the SOC Overview Sankey widget as it appears on the dashboard or report. |
| Data Source | Select whether you want to use static or live data to render the chart. You can choose between: **Record Containing JSON Data** or **Get Live Data**. <br />The **Record Containing JSON Data** option renders static data where all records in a single keystore record that contains a JSON object. The **Get Live Data**  option dynamically render nodes and links data. The live data is queried based on the selected module and fields. |
### Record Containing JSON Data option

Selecting this option renders the chart based on static data. The following table helps customize the **SOC Overview Sankey** widget when the **Record Containing JSON Data** option is selected:

| Fields                                   | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| JSON Data Source Modules                 | Select the custom module whose Sankey representation is to be displayed. The module that you select must contain JSON data. |
| Select a Field                           | Select the field (Column) of the module which contains the `JSON` data. Only JSON-type fields are available in the drop-down. |
| Filter Record Which Contains The JSON Data | Define the conditions to retrieve only those records that meet the filter conditions. |

### Get Live Data option

Selecting this option renders the chart based on live data. In this case the Sankey chart needs a source node and a target node. It then represents the flow from the source node to the target node using paths known as links. Following table helps customize the **SOC Overview Sankey** widget when the **Get Live Data** option is selected:

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Resource        | Select the FortiSOAR™ module whose Sankey representation is to be displayed. For example, **_Alerts_**. |
| Filter Criteria | Define the filter criteria using which to filter the data retrieved by this widget. |
| Label           | Enter the title of the layer to be displayed on the flow column. |
| Source Node     | Select the field, within the **_Resource_** module, to render source nodes, i.e., this is the source from which the resource link needs to start. Only the fields of type **_text_** are listed. |
| Target Node     | Select the picklist, within the **_Resource_** module, to render target nodes, i.e., this is target to which the resource link needs to connect. Target nodes must be of type **_picklist_**. <br /> **NOTE**: If the target node that you select is another related module or is of type `many-to-many` then another drop-down list named **Target Node Picklist** is displayed from which you need to select the picklist to render the target nodes. |
| Add Layer       | Adds a new layer to the Sankey chart widget. At least **one layer is mandatory**. You can append more layers or even delete a layer. You can have a maximum of **three** layers.<br /> **NOTE**: The target node of the previous layer becomes the source node for the next layer. |


| [Usage](./usage.md) |
| ------------------- |
