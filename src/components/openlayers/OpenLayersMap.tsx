import * as ol from 'openlayers';
import * as proj4 from 'proj4';
import {ExternalObjectComponent, ExternalObjectComponentProps} from '../ExternalObjectComponent';
import {arrayDiff} from '../../common/array-diff';

ol.proj.setProj4(proj4);

/**
 * Describes a "pin" to be displayed on the Cesium globe.
 */
export interface PinDescriptor {
    id: string;
    name?: string | null;
    visible: boolean;
    image: string;
    state: string;
    latitude: number;
    longitude: number;
}

/**
 * Describes an image layer to be displayed on the OpenLayers map.
 */
export interface LayerDescriptor {
    id: string;
    name?: string | null;
    visible: boolean;
    opacity?: number;
    layerFactory: (layerSourceOptions: any) => ol.layer.Layer;
    layerSourceOptions: any;
}

export interface OpenLayersMapProps extends ExternalObjectComponentProps<ol.Map, OpenLayersState>, OpenLayersState {
    offlineMode?: boolean;
    projectionCode?: string;
    onMapMounted?: (id: string, map: ol.Map) => void;
    onMapUnmounted?: (id: string, map: ol.Map) => void;
    onSelectRegion: (selectedRegion: string) => void;
    regionSelectorType: 'box' | 'polygon';
}

interface OpenLayersState {
    pins?: PinDescriptor[];
    layers?: LayerDescriptor[];
}

const EMPTY_ARRAY: any[] = [];

/**
 * A component that wraps an OpenLayers 4.0 2D Map.
 *
 * @author Norman Fomferra
 */
export class OpenLayersMap extends ExternalObjectComponent<ol.Map, OpenLayersState, OpenLayersMapProps, any> {

    private static setLayerProps(olLayer: ol.layer.Layer, newLayer: LayerDescriptor, oldLayer?: LayerDescriptor) {
        if (!oldLayer || oldLayer.visible !== newLayer.visible) {
            olLayer.setVisible(newLayer.visible);
        }
        if (!oldLayer || oldLayer.opacity !== newLayer.opacity) {
            olLayer.setOpacity(newLayer.opacity ? newLayer.opacity : 1);
        }
    }

    constructor(props: OpenLayersMapProps) {
        super(props);
    }

    newContainer(id: string): HTMLElement {
        const div = document.createElement('div');
        div.setAttribute('id', 'olmap-container-' + id);
        div.setAttribute('style', 'width: 100%; height: 100%; overflow: hidden;');
        return div;
    }

    newExternalObject(parentContainer: HTMLElement, container: HTMLElement): ol.Map {
        const options = {
            target: container,
            layers: [
                new ol.layer.Tile({
                    // source: new ol.source.OSM()
                    // source: new ol.source.CartoDB({}),
                    source: new ol.source.BingMaps({
                        key: 'AnCcpOxnAAgq-KyFcczSZYZ_iFvCOmWl0Mx-6QzQ_rzMtpgxZrPZZNxa8_9ZNXci',
                        imagerySet: 'AerialWithLabels',
                        reprojectionErrorThreshold: 0.5,
                    })
                })
            ],
            view: new ol.View({
                projection: this.props.projectionCode || 'EPSG:4326',
                center: [13, 42],
                zoom: 6,

            }),
            controls: ol.control.defaults({
                zoom: false,
                attribution: false,
                rotate: false
            })
        };
        // noinspection UnnecessaryLocalVariableJS
        const map = new ol.Map(options);

        if (this.props.regionSelectorType == 'polygon') {
            this.addPolygonDrawingLayer(map);
        } else {
            this.addBoxDrawingLayer(map);
        }

        // not yet working due to the file not properly hosted
        // let presetPolygonLayer = new ol.layer.Vector({
        //     source: new ol.source.Vector({
        //         url: 'http://bc-wps:9080/bc-wps/polygon.json',
        //         format: new ol.format.GeoJSON()
        //     })
        // });
        // console.log("source", presetPolygonLayer.getSource().getFeatures());
        // map.addLayer(presetPolygonLayer);

        return map;
    }

    updateExternalObject(map: ol.Map, prevState: OpenLayersState, nextState: OpenLayersState): void {
        const prevLayers = (prevState && prevState.layers) || EMPTY_ARRAY;
        const nextLayers = nextState.layers || EMPTY_ARRAY;
        if (prevLayers !== nextLayers) {
            this.updateMapLayers(map, prevLayers, nextLayers);
        }
    }

    componentWillUpdate(nextProps: OpenLayersMapProps & OpenLayersState): any {
        if (this.props.projectionCode !== nextProps.projectionCode) {
            this.forceRegeneration();
        }
        return super.componentWillUpdate(nextProps);
    }

    externalObjectMounted(map: ol.Map): void {
        map.updateSize();
        if (this.props.onMapMounted) {
            this.props.onMapMounted(this.props.id, map);
        }
    }

    externalObjectUnmounted(map: ol.Map): void {
        if (this.props.onMapUnmounted) {
            this.props.onMapUnmounted(this.props.id, map);
        }
    }

    private addBoxDrawingLayer(map: ol.Map) {
        /* Add drawing vector source */
        let drawingSource = new ol.source.Vector({
            useSpatialIndex: false
        });

        /* Add drawing layer */
        let drawingLayer = new ol.layer.Vector({
            source: drawingSource
        });
        map.addLayer(drawingLayer);

        let draw = new ol.interaction.Draw({
            source: drawingSource,
            type: 'Circle',
            // only draw when Ctrl is pressed.
            condition: ol.events.condition.platformModifierKeyOnly,
            geometryFunction: ol.interaction.Draw.createBox()
        });
        map.addInteraction(draw);

        /* add ol.collection to hold all selected features */
        let select = new ol.interaction.Select();
        map.addInteraction(select);
        let selectedFeatures = select.getFeatures();

        selectedFeatures.on('add', (event: any) => {
            let coordinates = event.target.item(0).getGeometry().getCoordinates();
            let polygonString: string = 'POLYGON((';
            console.log('coordinates', coordinates[0]);
            for (let coordinate of coordinates[0]) {
                polygonString = polygonString.concat(coordinate[0]).concat(' ').concat(coordinate[1]).concat(',');
            }
            polygonString = polygonString.concat('))');
            this.props.onSelectRegion(polygonString);
        });

        selectedFeatures.on('remove', () => {
            this.props.onSelectRegion('');
        });

        let sketch;

        /* Deactivate select and delete any existing polygons.
            Only one polygon drawn at a time. */
        draw.on(
            'drawstart', () => {
                drawingSource.clear();
                select.setActive(false);
            },
            this);

        /* Reactivate select after 300ms (to avoid single click trigger)
            and create final set of selected features. */
        draw.on('drawend', () => {
            sketch = null;
            setTimeout(
                () => {
                    select.setActive(true);
                },
                300);
            selectedFeatures.clear();
        });

        /* Modify polygons interaction */

        let modify = new ol.interaction.Modify({
            // only allow modification of drawn polygons
            features: drawingSource.getFeaturesCollection()
        });
        map.addInteraction(modify);

        /* Point features select/deselect as you move polygon.
            Deactivate select interaction. */
        modify.on(
            'modifystart', (event: any) => {
                sketch = event.features;
                select.setActive(false);
            },
            this);

        /* Reactivate select function */
        modify.on(
            'modifyend', () => {
                sketch = null;
                setTimeout(
                    () => {
                        select.setActive(true);
                    },
                    300);
                selectedFeatures.clear();
            },
            this);
    }

    private addPolygonDrawingLayer(map: ol.Map) {
        /* Add drawing vector source */
        let drawingSource = new ol.source.Vector({
            useSpatialIndex: false
        });

        /* Add drawing layer */
        let drawingLayer = new ol.layer.Vector({
            source: drawingSource
        });
        map.addLayer(drawingLayer);

        let draw = new ol.interaction.Draw({
            source: drawingSource,
            type: 'Polygon',
            // only draw when Ctrl is pressed.
            condition: ol.events.condition.platformModifierKeyOnly
        });
        map.addInteraction(draw);

        /* add ol.collection to hold all selected features */
        let select = new ol.interaction.Select();
        map.addInteraction(select);
        let selectedFeatures = select.getFeatures();

        selectedFeatures.on('add', (event: any) => {
            let coordinates = event.target.item(0).getGeometry().getCoordinates();
            let polygonString: string = 'POLYGON((';
            for (let coordinate of coordinates[0]) {
                polygonString = polygonString.concat(coordinate[0]).concat(' ').concat(coordinate[1]).concat(',');
            }
            polygonString = polygonString.concat('))');
            this.props.onSelectRegion(polygonString);
        });

        selectedFeatures.on('remove', () => {
            this.props.onSelectRegion('');
        });

        let sketch;

        /* Deactivate select and delete any existing polygons.
            Only one polygon drawn at a time. */
        draw.on(
            'drawstart', () => {
                drawingSource.clear();
                select.setActive(false);
            },
            this);

        /* Reactivate select after 300ms (to avoid single click trigger)
            and create final set of selected features. */
        draw.on('drawend', () => {
            sketch = null;
            setTimeout(
                () => {
                    select.setActive(true);
                },
                300);
            selectedFeatures.clear();
        });

        /* Modify polygons interaction */

        let modify = new ol.interaction.Modify({
            // only allow modification of drawn polygons
            features: drawingSource.getFeaturesCollection()
        });
        map.addInteraction(modify);

        /* Point features select/deselect as you move polygon.
            Deactivate select interaction. */
        modify.on(
            'modifystart', (event: any) => {
                sketch = event.features;
                select.setActive(false);
            },
            this);

        /* Reactivate select function */
        modify.on(
            'modifyend', () => {
                sketch = null;
                setTimeout(
                    () => {
                        select.setActive(true);
                    },
                    300);
                selectedFeatures.clear();
            },
            this);
    }

    private updateMapLayers(map: ol.Map, currentLayers: LayerDescriptor[], nextLayers: LayerDescriptor[]) {
        if (this.props.debug) {
            console.log('OpenLayersMap: updating layers');
        }
        const actions = arrayDiff<LayerDescriptor>(currentLayers, nextLayers);
        let olLayer: ol.layer.Layer;
        let newLayer: LayerDescriptor;
        let oldLayer: LayerDescriptor;
        for (let action of actions) {
            if (this.props.debug) {
                console.log('OpenLayersMap: next layer action', action);
            }
            // olIndex is +1 because of its base layer at olIndex=0
            const olIndex = action.index + 1;
            switch (action.type) {
                case 'ADD':
                    if (action.newElement) {
                        olLayer = this.addLayer(map, action.newElement, olIndex);
                        // TODO (forman): FIXME! Keep assertion here and below, but they currently fail.
                        //                Possible reason, new map views may not have their
                        //                'selectedVariable' layer correctly initialized. Same problem in CesiumGlobe!
                        // assert.ok(olLayer);
                        if (!olLayer) {
                            console.error('OpenLayersMap: no olLayer at index ' + olIndex);
                            break;
                        }
                        OpenLayersMap.setLayerProps(olLayer, action.newElement);
                    }
                    break;
                case 'REMOVE':
                    olLayer = map.getLayers().item(olIndex) as ol.layer.Tile;
                    // assert.ok(olLayer);
                    if (!olLayer) {
                        console.error('OpenLayersMap: no olLayer at index ' + olIndex);
                        break;
                    }
                    this.removeLayer(map, olIndex);
                    break;
                case 'UPDATE':
                    olLayer = map.getLayers().item(olIndex) as ol.layer.Tile;
                    // assert.ok(olLayer);
                    if (!olLayer) {
                        console.error('OpenLayersMap: no olLayer at index ' + olIndex);
                        break;
                    }
                    if (action.oldElement && action.newElement) {
                        oldLayer = action.oldElement;
                        newLayer = action.newElement;
                        if (oldLayer.layerSourceOptions.url !== newLayer.layerSourceOptions.url) {
                            if (oldLayer.name === newLayer.name &&
                                typeof((olLayer.getSource() as any).setUrl) === 'function') {
                                if (this.props.debug) {
                                    console.log('OpenLayersMap: reusing layer source');
                                }
                                // Reusable source:
                                // See http://openlayers.org/en/latest/examples/reusable-source.html?q=url
                                (olLayer.getSource() as ol.source.UrlTile).setUrl(newLayer.layerSourceOptions.url);
                            } else {
                                if (this.props.debug) {
                                    console.log('OpenLayersMap: exchanging layer');
                                }
                                // Replace layer
                                this.removeLayer(map, olIndex);
                                olLayer = this.addLayer(map, newLayer, olIndex);
                            }
                        }
                        OpenLayersMap.setLayerProps(olLayer, action.newElement, action.oldElement);
                    }
                    break;
                case 'MOVE':
                    olLayer = map.getLayers().item(olIndex) as ol.layer.Layer;
                    // assert.ok(olLayer);
                    if (!olLayer) {
                        console.error('OpenLayersMap: no olLayer at index ' + olIndex);
                        break;
                    }
                    map.getLayers().removeAt(olIndex);
                    map.getLayers().insertAt(olIndex + (action.numSteps ? action.numSteps : 0), olLayer);
                    break;
                default:
                    console.error(`OpenLayersMap: unhandled layer action type "${action.type}"`);
            }
        }
    }

    private addLayer(map: ol.Map, layerDescriptor: LayerDescriptor, layerIndex: number): ol.layer.Layer {
        const olLayer = layerDescriptor.layerFactory(layerDescriptor.layerSourceOptions);
        map.getLayers().insertAt(layerIndex, olLayer);
        if (this.props.debug) {
            console.log(`OpenLayersMap: added layer #${layerIndex}: ${layerDescriptor.name}`);
        }
        return olLayer;
    }

    private removeLayer(map: ol.Map, layerIndex: number): void {
        map.getLayers().removeAt(layerIndex);
        if (this.props.debug) {
            console.log(`OpenLayersMap: removed layer #${layerIndex}`);
        }
    }
}
