'use strict';

import $ from 'jquery';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import enquire from 'enquire.js';

export default class Map {
  constructor(config) {
    this.config = config;

    let $map = $('#map');
    let $data = $map.data('map');
    let $mapChart = document.getElementById('map');

    $.ajax({
      url: $data,
      method: 'GET',
      data: this.parameters,
      success: (res) => {
        am4core.useTheme(am4themes_animated);
        // Mobile view map init
        enquire.register(`screen and (max-width: ${this.config.breakpoints.tablet - 1}px)`, {
          match: () => {
            let chart = am4core.create($mapChart, am4maps.MapChart);
            this.chart = chart;
            let interfaceColors = new am4core.InterfaceColorSet();

            this.chart.geodata = am4geodata_worldLow;
            this.chart.projection = new am4maps.projections.Miller();

            // Disable Zoom & Drag
            this.chart.maxZoomLevel = 1;
            this.chart.chartContainer.wheelable = true;
            // chart.seriesContainer.resizable = false;
            // chart.chartContainer.background.events.disableType('doublehit');

            // Set projection
            this.chart.projection = new am4maps.projections.Orthographic();
            this.chart.panBehavior = "rotateLongLat";
            this.chart.padding(20,20,20,20);

            this.chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#184493");
            this.chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.8;
            this.chart.deltaLongitude = -15;
            this.chart.deltaLatitude = -35;

            // limits vertical rotation
            this.chart.adapter.add("deltaLatitude", function(delatLatitude){
              return am4core.math.fitToRange(delatLatitude, -90, 90);
            });

            // Create map polygon series
            let shadowPolygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
            shadowPolygonSeries.geodata = am4geodata_continentsLow;
            shadowPolygonSeries.useGeodata = true;
            shadowPolygonSeries.dx = 2;
            shadowPolygonSeries.dy = 2;
            shadowPolygonSeries.mapPolygons.template.fill = am4core.color("#000");
            shadowPolygonSeries.mapPolygons.template.fillOpacity = 0.2;
            shadowPolygonSeries.mapPolygons.template.strokeOpacity = 0;
            shadowPolygonSeries.fillOpacity = 0.1;
            shadowPolygonSeries.fill = am4core.color("#000");

            // Create map polygon series
            let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.useGeodata = true;

            polygonSeries.calculateVisualCenter = true;
            polygonSeries.tooltip.background.fillOpacity = 0.2;
            polygonSeries.tooltip.background.cornerRadius = 20;

            let polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.polygon.fill = am4core.color('#FFF');
            polygonTemplate.stroke = am4core.color('#E6E6E6');
            polygonTemplate.polygon.fillOpacity = 1;

            let imageSeries = this.chart.series.push(new am4maps.MapImageSeries());
            imageSeries.data = res;
            imageSeries.mapImages.template.propertyFields.longitude = "longitude";
            imageSeries.mapImages.template.propertyFields.latitude = "latitude";

            // Map pins
            let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle2.radius = 8;
            circle2.fill = am4core.color('#F39200');
            circle2.events.on("inited", (event) => {
              animateBullet(event.target);
            });

            let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle.radius = 8;
            circle.fill = am4core.color('#F39200');
            circle.stroke = am4core.color('#FFF');
            circle.nonScaling = true;

            let animateBullet = (circle) => {
              let animation = circle.animate([
                { property: "scale", from: 1 / this.chart.zoomLevel, to: 3 / this.chart.zoomLevel }, 
                { property: "opacity", from: 1, to: 0 }
              ], 2500, am4core.ease.cubicOut);
              animation.events.on("animationended", (event) => {
                animateBullet(event.target.object);
              });
            }

            imageSeries.mapImages.template.tooltipHTML = '<div class="tooltip-wrap"><h4 class="tooltip-country">{title}</h4><div class="tooltip-city"></div></div>';
            imageSeries.mapImages.template.fill = am4core.color('#0E254E');
            // imageSeries.mapImages.template.showTooltipOn = "always";

            imageSeries.mapImages.template.adapter.add('tooltipHTML', (html, target) => {
              if (target.tooltipDataItem.dataContext && target.tooltipDataItem.dataContext.locations && target.tooltipDataItem.dataContext.locations.length) {
                let $loc = '';
                target.tooltipDataItem.dataContext.locations.forEach(loc => {
                  $loc += `<li class="location">${loc}</li>`;
                });

                html += `<ul class="location-wrap">${$loc}</ul>`;               
              }
              return html;
            });
          },
          unmatch: () => {
          }
        });

        // Desktop view map init
        enquire.register(`screen and (min-width: ${this.config.breakpoints.tablet}px)`, {
          match: () => {	
            let chartD = am4core.create($mapChart, am4maps.MapChart);
            this.chartD = chartD;
            let interfaceColors = new am4core.InterfaceColorSet();

            this.chartD.geodata = am4geodata_worldLow;
            this.chartD.projection = new am4maps.projections.Miller();

            // Disable Zoom & Drag
            this.chartD.maxZoomLevel = 1;
            this.chartD.seriesContainer.draggable = false;
            // this.chartD.seriesContainer.resizable = false;
            // this.chartD.chartContainer.background.events.disableType('doublehit');
            this.chartD.chartContainer.wheelable = false;

            let polygonSeries = this.chartD.series.push(new am4maps.MapPolygonSeries());

            const shadow = polygonSeries.filters.push(new am4core.DropShadowFilter);
            shadow.dx = 0;
            shadow.dy = 0;
            shadow.blur = 3;
            shadow.opacity = 0.2;

            polygonSeries.exclude = ["AQ"];
            polygonSeries.useGeodata = true;

            let polygonTemplate = polygonSeries.mapPolygons.template;
            polygonTemplate.polygon.fill = am4core.color('#FFF');
            polygonTemplate.stroke = am4core.color('#E6E6E6');
            polygonTemplate.polygon.fillOpacity = 1;

            let imageSeries = this.chartD.series.push(new am4maps.MapImageSeries());
            imageSeries.data = res;
            imageSeries.mapImages.template.propertyFields.longitude = "longitude";
            imageSeries.mapImages.template.propertyFields.latitude = "latitude";

            // Map pins
            let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle2.radius = 8;
            circle2.fill = am4core.color('#F39200');
            circle2.events.on("inited", (event) => {
              animateBullet(event.target);
            });

            let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
            circle.radius = 8;
            circle.fill = am4core.color('#F39200');
            circle.stroke = am4core.color('#FFF');
            circle.nonScaling = true;

            let animateBullet = (circle) => {
              let animation = circle.animate([
                { property: "scale", from: 1 / this.chartD.zoomLevel, to: 3 / this.chartD.zoomLevel }, 
                { property: "opacity", from: 1, to: 0 }
              ], 2500, am4core.ease.cubicOut);
              animation.events.on("animationended", (event) => {
                animateBullet(event.target.object);
              });
            }

            imageSeries.mapImages.template.tooltipHTML = '<div class="tooltip-wrap"><h4 class="tooltip-country">{title}</h4><div class="tooltip-city"></div></div>';
            imageSeries.mapImages.template.fill = am4core.color('#0E254E');
            // imageSeries.mapImages.template.showTooltipOn = "always";

            imageSeries.mapImages.template.adapter.add('tooltipHTML', (html, target) => {
              if (target.tooltipDataItem.dataContext && target.tooltipDataItem.dataContext.locations && target.tooltipDataItem.dataContext.locations.length) {
                let $loc = '';
                target.tooltipDataItem.dataContext.locations.forEach(loc => {
                  $loc += `<li class="location">${loc}</li>`;
                });

                if (target.tooltipDataItem.dataContext.col == 2) {
                  html += `<ul class="location-wrap two-col">${$loc}</ul>`;
                } else {
                  html += `<ul class="location-wrap">${$loc}</ul>`;
                }                
              }
              return html;
            });
          },
          unmatch: () => {
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
