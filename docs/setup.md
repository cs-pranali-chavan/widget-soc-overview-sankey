| [Home](../README.md) |
| -------------------- |

# Installation

1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appear, search for and select **SOC Overview Sankey**.
3. Click the **SOC Overview Sankey** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

Following table helps customize the **SOC Overview Sankey** widget:

| Fields                                     | Description                                                                                                                                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title                                      | Specify a title.                                                                                                                                                      |
| Resource                                   | Select the module.                                                                                                                                                       |
| Filter Criteria                            | Define the filter criteria using which to filter the data retrieved by this widget.                                                                                                                                             |
| Source Nodes                               | Select the field to render source nodes.                                                                                                                                                               |
| Target Nodes                               | Select the picklist to render target nodes.                                                                                                                                                    |
| Relationship Resource                      | Choose the relationship module to get picklist details for relationship nodes.                                                                                                                                                                        |
| Relationship Nodes                         | Select the picklist to render relationship nodes.                                                          |
| External Source JSON                       | Enter JSON data to render sources which generates events.                                                                                       |

## External Source JSON format

Here JSON object requires 2 array properties. Nodes and Links.
Sample JSON format:
{
    "nodes": [
        {
            "name": "Fortinet Networks"
        },
        {
            "name": "Fortinet Endpoints"
        },
        .
        .
        .
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
        },
        .
        .
        .
    ]
}


| [Usage](./usage.md) |
| ------------------- |