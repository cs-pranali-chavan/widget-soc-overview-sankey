| [Home](../README.md) |
| -------------------- |

# Installation

1. To install a widget, click **Content Hub** > **Discover**.
2. From the list of widgets that appear, search for and select **SOC Overview Sankey**.
3. Click the **SOC Overview Sankey** widget card.
4. Click **Install** on the lower part of the screen to begin installation.

# Configuration

A Sankey chart needs a source node and a target node. It then represents the flow from the source node to the target node using paths known as links. Following table helps customize the **SOC Overview Sankey** widget:

| Fields                | Description                                                                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Title                 | Specify a title for the SOC Overview Sankey widget as it appears on the dashboard.                                                             |
| Resource              | Select the FortiSOAR&trade; module whose Sankey representation is to be displayed. For example, **_Alerts_**.                                  |
| Filter Criteria       | Define the filter criteria using which to filter the data retrieved by this widget.                                                            |
| Source Nodes          | Select the a field, within the **_Resource_** module, to render source nodes. Only the fields of type **_text_** are listed.                   |
| Target Nodes          | Select the picklist, within the **_Resource_** module, to render target nodes. Only the fields of type **_picklist_** are listed.              |
| Relationship Resource | Select the FortiSOAR&trade; module, which has a relationship to the module selected in the **Resource** field. For example, **_Incidents_** |
| Relationship Nodes    | Select the picklist, within the **_Relationship Resource_** module, to render target nodes. Only the fields of type **_picklist_** are listed. |
| External Source JSON  | Enter JSON data to render custom sources that generate events.                                                                                 |

## External Source JSON format

Here the JSON object requires 2 array properties, **`Nodes`** and **`Links`**. Value in **`Nodes`** act as a *`Source`* node for the module selected in the **Resource** field.

When building links for the Sankey charts using *`External Source JSON`* field consider the following:

- The source contains the various sources of the records being rendered and is listed under *`"nodes"`* object in JSON. For example, Fortinet Networks, Fortinet Endpoints, or others.

- For the *`"links"`* object:
    - *`"source"`* should contain one of the *`"nodes"`*
    - *`"target"`* should contain one of the **Source Nodes** specified when configuring the widget
    - *`"total"`* contains the number of records. For example, if there were `71` alerts from Fortinet Networks with *Source* as **Email Server**, enter `71` for the *`"total"`* object

Following is a sample JSON that can be entered in the **External Source JSON** field.

```JSON
{
  "nodes": [
    {
      "name": "Fortinet Networks"
    },
    {
      "name": "Fortinet Endpoints"
    },
    {
      "name": "Other"
    }
  ],
  "links": [
    {
      "source": "Fortinet Networks",
      "target": "Email Server",
      "total": 71
    },
    {
      "source": "Fortinet Networks",
      "target": "ArcSight",
      "total": 27
    },
    {
      "source": "Fortinet Networks",
      "target": "BMCRemedy",
      "total": 28
    },
    {
      "source": "Fortinet Networks",
      "target": "QRadar",
      "total": 35
    },
    {
      "source": "Fortinet Networks",
      "target": "McAfee ESM",
      "total": 2
    },
    {
      "source": "Fortinet Endpoints",
      "target": "Email Server",
      "total": 20
    },
    {
      "source": "Fortinet Endpoints",
      "target": "FortiSIEM",
      "total": 11
    },
    {
      "source": "Fortinet Endpoints",
      "target": "ArcSight",
      "total": 12
    },
    {
      "source": "Fortinet Endpoints",
      "target": "QRadar",
      "total": 4
    },
    {
      "source": "Fortinet Endpoints",
      "target": "Splunk",
      "total": 34
    },
    {
      "source": "Other",
      "target": "Email Server",
      "total": 15
    },
    {
      "source": "Other",
      "target": "FortiSIEM",
      "total": 27
    },
    {
      "source": "Other",
      "target": "ArcSight",
      "total": 7
    },
    {
      "source": "Other",
      "target": "BMCRemedy",
      "total": 22
    },
    {
      "source": "Other",
      "target": "QRadar",
      "total": 40
    },
    {
      "source": "Other",
      "target": "McAfee ESM",
      "total": 21
    },
    {
      "source": "Other",
      "target": "Splunk",
      "total": 3
    },
    {
      "source": "Other",
      "target": "Microsoft 365 Defender",
      "total": 7
    },
    {
      "source": "Other",
      "target": "User Reported",
      "total": 2
    }
  ]
}
```
Following image shows the Sankey chart with **External Source JSON** field populated with the sample JSON.

![](./res/sankey-with-custom-data.png)

| [Usage](./usage.md) |
| ------------------- |
