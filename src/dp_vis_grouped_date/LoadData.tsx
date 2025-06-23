import React, { useMemo } from "react";
import { DataViewFacade, GoodDataSdkError, UseCancelablePromiseState } from "@gooddata/sdk-ui";
import {
    IDashboardInsightProps,
    selectIsInViewMode,
    useDashboardSelector,
    useInsightWidgetDataView,
} from "@gooddata/sdk-ui-dashboard";
import GroupedDateDropdown from "./GroupedDateSelect.js";
import { useHideOriginalWidgetTitleInViewMode } from "./useHideOriginalWidgetTitleInViewMode.js";
import { WIDGET_TITLE_SUFFIX } from "./Plugin.js";
import { CustomTitle } from "./CustomTitle.js";

const LoadData: React.FC<JSX.IntrinsicAttributes & IDashboardInsightProps> = (
    props: JSX.IntrinsicAttributes & IDashboardInsightProps,
) => {
    const { LoadingComponent, ErrorComponent, widget } = props;

    const isInViewMode = useDashboardSelector(selectIsInViewMode);

    // replace the original widget title with a new one without the suffix
    useHideOriginalWidgetTitleInViewMode(widget, isInViewMode);
    const customWidgetTitleComponent = useMemo(() => {
        const titleWithoutSuffix = widget.title.replace(WIDGET_TITLE_SUFFIX, "");

        return isInViewMode ? <CustomTitle>{titleWithoutSuffix}</CustomTitle> : null;
    }, [widget.title, isInViewMode]);

    const { result, error, status }: UseCancelablePromiseState<DataViewFacade, GoodDataSdkError> =
        useInsightWidgetDataView({
            insightWidget: widget,
        });

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error") {
        return <ErrorComponent message={error?.message ?? "Unknown error"} />;
    }

    return (
        <>
            {customWidgetTitleComponent}
            <GroupedDateDropdown result={result} />
        </>
    );
};

export default LoadData;
