| [Home](../README.md) |
| -------------------- |

# Usage

The **SOC Overview Sankey** widget helps visualise relationship data as per behavior. For example, viewing the data as per status of related incidents of alerts group by source and severity.

You can add this view to a dashboard, or report.

## Features

- Visualize relationship data as per duration. Standard durations are provided upfront as a part of widget like 7 Days, 1 Day, and 1 Hour. Other filter specific configurations can be done by editing settings. 

- Configure the widget by selecting module-wise source node, target node, relationship node and setting filters to retrieve the required data.

- Colors will be picked as per configured in picklist.

## SOC Overview Sankey Widget

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.

2. Select **SOC Overview Sankey** from the list to bring up the **SOC Overview Sankey** widget's customization modal.

3. Specify the title of the visualisation of relationship data as per module in the **Title** field.

4. Select the module, whose data to be visualize as per relationship, in the **Resource** field.

5. Define the filter criteria using which to filter the data retrieved by this widget (Optional).

6. Select the text field to be grouped for source nodes, in the **Source Nodes** field.

7. Select the picklist field to group data for target nodes, in the **Target Nodes** field.

8. Select the relationship module, to group data to visualize as per relation, in the **Relationship Resource** field.

9. Select the picklist field of selected relationship resource to group data for relationship nodes, in the **Relationship Nodes** field.

10. Input JSON data to render outer source nodes and linking with modules source, in the **External Source JSON** field.

### SOC Overview Sankey Widget - View

The following image displays a **SOC Overview Sankey** widget based on an example where you might want to view the data as per severity of related incidents of alerts group by source and severity:

![Displaying the SOC Overview Sankey Chart on a Dashboard](./images/soc-overview-sankey.png)

In above example, clicking **1 Day** displays a data for last 1 day. Same for **1 Hour** it shows data for last 1 Hour. **7 Days** is a default behavior while initial rendering.

<table>
    <td><strong>NOTE</strong></td><td>If for any specific duration selection there is no data, then the <strong>SOC Overview Sankey</strong> widget displays the following message:<br><br>
    <strong>No records found!</strong></td>
</table>

| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) |
| --------------------------------------- | ----------------------------------------- |