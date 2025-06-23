// (C) 2024 GoodData Corporation
import React from "react";
import {
    DashboardContext,
    DashboardInitialized,
    DashboardPluginV1,
    IDashboardCustomizer,
    IDashboardEventHandling,
    IDashboardInsightProps,
} from "@gooddata/sdk-ui-dashboard";
import { IInsight, IInsightWidget, widgetTitle } from "@gooddata/sdk-model";

import entryPoint from "../dp_vis_grouped_date_entry/index.js";
import LoadData from "./LoadData.js";

export const WIDGET_TITLE_SUFFIX = "_grouped_date";
const RE = new RegExp(`(.*)${WIDGET_TITLE_SUFFIX}$`);

export class Plugin extends DashboardPluginV1 {
    author = entryPoint.author;
    displayName = entryPoint.displayName;
    version = entryPoint.version;
    compatibility = entryPoint.compatibility;
    minEngineVersion = entryPoint.minEngineVersion;
    maxEngineVersion = entryPoint.maxEngineVersion;
    targettingInsightId = "";

    onPluginLoaded(_ctx: DashboardContext, _parameters: string) {
        /*
         * This will be called when the plugin is loaded in context of some dashboard and before
         * the register() method.
         *
         * If the link between the dashboard and this plugin is parameterized, then all the parameters will
         * be included in the parameters string.
         *
         * The parameters are useful to modify plugin behavior in context of particular dashboard.
         *
         * Note: it is safe to delete this stub if your plugin does not need any specific initialization.
         */
    }

    register(_ctx: DashboardContext, customize: IDashboardCustomizer, handlers: IDashboardEventHandling) {
        customize.insightWidgets().withCustomProvider((insight: IInsight, widget: IInsightWidget) => {
            const identifierRef = insight.insight.identifier;
            if (identifierRef == this.targettingInsightId || widgetTitle(widget).match(RE)) {
                if (!this.targettingInsightId) {
                    this.targettingInsightId = identifierRef;
                }

                return (props: JSX.IntrinsicAttributes & IDashboardInsightProps) => {
                    return <LoadData {...props} />;
                };
            }

            return undefined;
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (event: DashboardInitialized) => {
            // eslint-disable-next-line no-console
            console.log("### Dashboard initialized", event);
        });
    }

    onPluginUnload(_ctx: DashboardContext) {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}
