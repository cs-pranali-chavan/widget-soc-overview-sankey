| [Home](../README.md) |
| -------------------- |

# Usage

The **Sankey** widget helps visualize data, which is rendered based on static or live data. To use static data, the **Record Containing JSON Data** option should be selected from the Data Source field while configuring the widget, whereas select the **Get Live Data** option to use live data. You can add this widget to a dashboard, or a report.

## Use static data to visualize data in the Sankey widget  

The **Record containing JSON Data** option helps retrieve and display data from a record that has values in the  `JSON` format. Select this option if all data to be rendered is in a specific field of the module. The widget has filters to select only that record that meets the filter conditions. For example, displaying a chart that represents the number of Mitre Group records group on the basis of their source and severity.

<table>

```
<th>NOTE</th>
<td>The links colors are picked as per picklist items configuration.</td>
```

</table>

### Configuring the Sankey widget to represent Mitre Group Data

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.

    ![](./res/sankey-edit-00.png)

2. Select **Sankey** from the list to bring up the **Sankey** widget's customization modal.

    ![](./res/sankey-edit-01.png)

3. In the **Title** field, specify the title of the graphical representation. 

4. From the **Data Source** field, select the **Record Containing JSON Data** option.

5. From the **JSON Data Source Modules** drop-down list, select the module whose records contain `JSON` data. For our example, we have selected a custom module named 'Key Store'. For details on editing and creating modules, refer to the *Module Editor* section of the FortiSOAR *Administration Guide*, [here](https://docs.fortinet.com/document/fortisoar/7.5.0/administration-guide/97786/application-editor#Module_Editor). 

    ![](./res/sankey-edit-staticData-00.png)

6. From the **Select Field** drop-down list, select the field, whose data is to be displayed. The drop-down lists **_only_** the fields of type `JSON`. For our example, we have selected a field within the 'Key Store' custom module. For details on editing and creating fields, refer to the *Module Editor* section of the FortiSOAR *Administration Guide*, [here](https://docs.fortinet.com/document/fortisoar/7.5.0/administration-guide/97786/application-editor#Module_Editor).

    A sample of a `JSON` type field is given [here](#sampleJson).

7. In the **Filter Record Which Contains The JSON** field, specify the keys of the JSON field using which data should be filtered and then appropriately fetched to be displayed in the chart. For our example, we want to display 'Mitre Group Data' and therefore, `Key Equals Mitre Group Data` is added as the filter condition.  
    ![](./res/sankey-edit-staticData-01.png)
    <table>
        <tr>
            <th>NOTE</th>
            <td>The filter conditions should be such that they select <strong><em>only</em></strong> the record that contains relevant JSON data.</td>
        </tr>
    </table>

8. Click **Save** to save the configuration.


#### Sankey widget to represent Mitre Group Data - View

The following image displays a **Sankey** widget based on an example where you want to view the number of Mitre Group records group on the basis of their source and severity:

![Displaying the Sankey Chart on a Dashboard using static data](./res/soc-overview-sankey-static-data.png)

<table>
    <th>NOTE</th>
    <td>In the case of static data, the duration buttons do not appear as the entire static data in the selected key is  rendered</td>
</table>

#### Sample JSON type field <a name="sampleJson"></a>

Following is a sample of a field that contains data in the `JSON` format, which can be rendered in the Sanky chart:

```JSON
{
  "data_1": [
    {
      "total": 1,
      "series_0": "Incident1",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident1 (1)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident1 (1) (1)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident1 (2)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident2",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident2 (1)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident2 (1) (1)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "Incident2 (2)",
      "series_1": "Medium",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_0": "IncidentA",
      "series_1": "Low",
      "color_series_1": "#28B35C"
    },
    {
      "total": 1,
      "series_0": "Incidentcr",
      "series_1": "Critical",
      "color_series_1": "#e31b1d"
    },
    {
      "total": 1,
      "series_0": "Incidentcr (1)",
      "series_1": "Critical",
      "color_series_1": "#e31b1d"
    },
    {
      "total": 1,
      "series_0": "incident high",
      "series_1": "High",
      "color_series_1": "#DE7A13"
    },
    {
      "total": 1,
      "series_0": "incident high (1)",
      "series_1": "High",
      "color_series_1": "#DE7A13"
    },
    {
      "total": 1,
      "series_0": "Incident roi",
      "series_1": "Minimal",
      "color_series_1": "#157DD9"
    }
  ],
  "data_2": [
    {
      "total": 1,
      "series_1": "Critical",
      "series_2": "Incidentcr",
      "color_series_1": "#e31b1d"
    },
    {
      "total": 1,
      "series_1": "Critical",
      "series_2": "Incidentcr (1)",
      "color_series_1": "#e31b1d"
    },
    {
      "total": 1,
      "series_1": "High",
      "series_2": "incident high",
      "color_series_1": "#DE7A13"
    },
    {
      "total": 1,
      "series_1": "High",
      "series_2": "incident high (1)",
      "color_series_1": "#DE7A13"
    },
    {
      "total": 1,
      "series_1": "Low",
      "series_2": "IncidentA",
      "color_series_1": "#28B35C"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident1",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident1 (1)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident1 (1) (1)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident1 (2)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident2",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident2 (1)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident2 (1) (1)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Medium",
      "series_2": "Incident2 (2)",
      "color_series_1": "#D2AC1A"
    },
    {
      "total": 1,
      "series_1": "Minimal",
      "series_2": "Incident roi",
      "color_series_1": "#157DD9"
    }
  ]
}
```
## Use live data to visualize relationship data in the Sankey widget  

The **Get Live Data** option helps helps visualize relationship data as per behavior. For example, viewing the data as per the severity of incidents related to alerts grouped by source, severity. and type. 

### Visualize Relationship Data for a Preset Interval

- You can select from following options:

    - Last 6 Months 
    - Last 3 Months
    - Last 30 Days

        ![Sankey chart time intervals](./res/sankey-chart-time-intervals.png)

- Configure the widget by selecting the **Get Live Data** option and then selecting the source node, target node, relationship node, and setting filters to retrieve the required data.

- The links colors are picked as per picklist items configuration.

### Configuring the Sankey widget to represent relationship data

1. Edit a *Dashboard*, or a *Report* and select **Add Widget** button.

2. Select **Sankey** from the list to bring up the **Sankey** widget's customization modal.

3. In the **Title** field, specify the title of the visualization of relationship data as per module.

4. From the **Resource** drop-down list, select the module, whose data is to be represented as a Sankey chart as per relationship. For our example, select **Alerts**.

5. (Optional) In the **Filter Criteria** field, specify the filter criteria using which to filter the data retrieved by this widget. To know more about using the filter criteria, refer to the [Nested Filter](https://docs.fortinet.com/document/fortisoar/7.5.0/user-guide/207943/dashboards-templates-and-widgets#Nested-Filters) section of the FortiSOAR™ user guide.

6. In the **Label** field, specify the title of the layer to be displayed on the flow column. For example, `Sources > Severity`, to represent the flow column from alert sources to alert severity.

7. From the the **Source Node** drop-down list, select the field to group data for source nodes. This is the source from which the resource link needs to start. Only the fields of type **_text_** are listed. For our example, select **Source**.

8. From the **Target Nodes** drop-down list, select the field to group data for target nodes. This is target to which the resource link needs to connect. Target nodes must be of type **_picklist_**. For our example, select **Severity**.

9. Click **Add Layer** to add a new layer to the widget. At least **one layer is mandatory**. You can append more layers or even delete a layer. You can have a maximum of **three** layers.<br /> **NOTE**: The target node of the previous layer becomes the source node for the next layer.

    ![](./res/sankey-edit-live-data-00.png)

10. Select the record count to fetch from the **Number of records to be fetched** field. You can choose from the following options:
    - **30** - Select this option to fetch only 30 records.
    - **ALL RECORDS** - Select this option to fetch *all available records*.

11. For our example, we require three layers. In the second layer, specify the label of the layer as `Severity > Type`, to represent the flow column from alert severity to alert type.   
 The **Source Node** field is already populated with the target node of the first layer, which is `Alerts -> Severity` in our example. Next, select the **Target Node** as **Type**.

   ![](./res/sankey-edit-live-data-01.png)

12. Click **Add Layer** to add the final layer in the widget. In this layer, we want to represent relationship data, i.e., the incidents related to alerts. In this layer, specify the label of the layer as `Alert Type > Related Incidents Severity`, to represent the flow column from alert type to related incidents severity.  
     The **Source Node** field is already populated with the target node of the second layer, which is `Alerts -> Type` in our example.  
     Next, select the **Target Node** as **Incidents** as we want to represent relationship data. Now, since the target node selected is a related module, another drop-down list named **Target Node Picklist** is displayed. Select the **Severity** picklist to render the target nodes.  

     ![](./res/sankey-edit-live-data-02.png)

13. Click **Save** to save the configuration.


### Sankey widget to represent relationship data

The following image displays a **Sankey** widget based on an example where you might want to view the data as per the severity of incidents related to alerts grouped by source, severity. and type. 

![Displaying the Sankey Chart on a Dashboard](./res/soc-overview-sankey.png)

1. Click **Last 6 Months** to display data for the last 6 months. This option is a default selection for the initial rendering.

2. Click **Last 3 Months** to display data for the last 3 months.

3. Click **Last 30 Days** to display data for the last 30 days.

<table>
    <tr>
        <th>NOTE</th>
    </tr>
    <tr>
        <td>If for a specific duration selection there is no data, the <strong>Sankey</strong> widget displays the following message:
        <pre>No records found!</pre>
        Also, if the data selection is not valid, the nodes and links data are not formed correctly. In this case, the <strong>Sankey</strong> widget displays the following message:
        <pre>Nodes and Links not created by the given data!</pre></td>
    </tr>
</table>


| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) |
| --------------------------------------- | ----------------------------------------- |
