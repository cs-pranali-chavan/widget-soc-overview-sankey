| [Home](../README.md) |
| -------------------- |

# Installation

1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appear, search for and select **SOC Overview Sankey**.
3. Click the **SOC Overview Sankey** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

A Sankey chart needs a source node and a target node. It then represents the flow from the source node to the target node using paths known as links. Following table helps customize the **SOC Overview Sankey** widget:

| Fields                | Description                                                                         |
|-----------------------|-------------------------------------------------------------------------------------|
| Title                 | Specify a title for the SOC Overview Sankey widget as it appears on the dashboard.  |
| Resource              | Select the module whose Sankey representation is to be displayed.                   |
| Filter Criteria       | Define the filter criteria using which to filter the data retrieved by this widget. |
| Source Nodes          | Select the field to render source nodes.                                            |
| Target Nodes          | Select the picklist to render target nodes.                                         |
| Relationship Resource | Select the relationship module to get picklist details for relationship nodes.      |
| Relationship Nodes    | Select the picklist to render relationship nodes.                                   |
| External Source JSON  | Enter JSON data to render sources which generates an events.                        |

## External Source JSON format

Here JSON object requires 2 array properties, **`Nodes`** and **`Links`**. Value in **`Nodes`** act as a *`Source`* node for the module selected in the **Resource** field.

Following is a sample JSON that can be entered in the **External Source JSON** field.

```JSON
{
    "nodes": [
        {
            "name": "Fortinet Networks"
        },
        {
            "name": "Fortinet Endpoints"
        }
    ],
    "links": [
        {
            "source": "Fortinet Networks",
            "target": "Email Server",
            "total": 439
        },
        {
            "source": "Fortinet Networks",
            "target": "ArcSight",
            "total": 67
        }
    ]
}
```
Following image shows the Sankey chart with **External Source JSON** field populated with the sample JSON.

![](./res/sankey-with-custom-data.png)

| [Usage](./usage.md) |
| ------------------- |
