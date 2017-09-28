export function getExecuteRequest(inputDatasetName: string) {
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>\n' +
        '\n' +
        '<wps:Execute service="WPS"\n' +
        '             version="1.0.0"\n' +
        '             xmlns:wps="http://www.opengis.net/wps/1.0.0"\n' +
        '             xmlns:ows="http://www.opengis.net/ows/1.1"\n' +
        '             xmlns:cal="http://www.brockmann-consult.de/calwps/calwpsL3Parameters-schema.xsd"\n' +
        '             xmlns:xlink="http://www.w3.org/1999/xlink">\n' +
        '\n' +
        '\t<ows:Identifier>urbantep-subsetting~1.0~Subset</ows:Identifier>\n' +
        '\n' +
        '\t<wps:DataInputs>\n' +
        '\t\t<wps:Input>\n' +
        '\t\t\t<ows:Identifier>productionType</ows:Identifier>\n' +
        '\t\t\t<wps:Data>\n' +
        '\t\t\t\t<wps:LiteralData>L2Plus</wps:LiteralData>\n' +
        '\t\t\t</wps:Data>\n' +
        '\t\t</wps:Input>\n' +
        '\t\t<wps:Input>\n' +
        '\t\t\t<ows:Identifier>productionName</ows:Identifier>\n' +
        '\t\t\t<wps:Data>\n' +
        '\t\t\t\t<wps:LiteralData>TEP Subset test</wps:LiteralData>\n' +
        '\t\t\t</wps:Data>\n' +
        '\t\t</wps:Input>\n' +
        '\t\t<wps:Input>\n' +
        '\t\t\t<ows:Identifier>inputDataSetName</ows:Identifier>\n' +
        '\t\t\t<wps:Data>\n' +
        '\t\t\t\t<wps:LiteralData>' + inputDatasetName + '</wps:LiteralData>\n' +
        '\t\t\t</wps:Data>\n' +
        '\t\t</wps:Input>\n' +
        '      \t<wps:Input>\n' +
        '\t\t\t<ows:Identifier>regionWKT</ows:Identifier>\n' +
        '\t\t\t<wps:Data>\n' +
        '\t\t\t\t<wps:LiteralData>POLYGON((12.919921875 52.93270653935951,13.95263671875 52.93270653935951,' +
        '13.95263671875 52.157716515928726,12.919921875 52.157716515928726,12.919921875 52.93270653935951))' +
        '</wps:LiteralData>\n' +
        '\t\t\t</wps:Data>\n' +
        '\t\t</wps:Input>\n' +
        '\t\t<wps:Input>\n' +
        '\t\t\t<ows:Identifier>outputFormat</ows:Identifier>\n' +
        '\t\t\t<wps:Data>\n' +
        '\t\t\t\t<wps:LiteralData>NetCDF4</wps:LiteralData>\n' +
        '\t\t\t</wps:Data>\n' +
        '      </wps:Input>\n' +
        '\n' +
        '\t\t\n' +
        '\t</wps:DataInputs>\n' +
        '\t<wps:ResponseForm>\n' +
        '\t\t<wps:ResponseDocument storeExecuteResponse="true" status="true">\n' +
        '\t\t\t<wps:Output>\n' +
        '\t\t\t\t<ows:Identifier>productionResults</ows:Identifier>\n' +
        '\t\t\t</wps:Output>\n' +
        '\t\t</wps:ResponseDocument>\n' +
        '\t</wps:ResponseForm>\n' +
        '</wps:Execute>'
    );
}