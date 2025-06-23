// (C) 2024 GoodData Corporation
import React, { ChangeEvent, useState } from "react";

import { LineChart } from "@gooddata/sdk-ui-charts";
import { IdentifierRef, newAttribute } from "@gooddata/sdk-model";
import { DataViewFacade } from "@gooddata/sdk-ui";
import s from "./GroupedDateSelect.module.css";

interface IGroupedDateDropdown {
    result: DataViewFacade;
}

enum DateGranularity {
    year = "year",
    quarter = "quarter",
    month = "month",
    week = "week",
    day = "day",
}

const getValue = (id: string) => {
    if (id.includes(DateGranularity.year)) {
        return DateGranularity.year;
    }
    if (id.includes(DateGranularity.quarter)) {
        return DateGranularity.quarter;
    }
    if (id.includes(DateGranularity.month)) {
        return DateGranularity.month;
    }
    if (id.includes(DateGranularity.week)) {
        return DateGranularity.week;
    }
    if (id.includes(DateGranularity.day)) {
        return DateGranularity.day;
    }
};

const GroupedDateDropdown: React.FC<IGroupedDateDropdown> = ({ result }: IGroupedDateDropdown) => {
    const attrIdentifier = (result.definition.attributes[0].attribute.displayForm as IdentifierRef)
        .identifier;

    const [trendBy, setTrendBy] = useState(result.definition.attributes[0]);

    const handleOnChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const identifier = (trendBy.attribute.displayForm as IdentifierRef).identifier;
        const replacing = identifier.split(".").slice(-1)[0];
        setTrendBy(newAttribute(identifier.replace(replacing, e.target.value)));
    };

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <select
                defaultValue={getValue(attrIdentifier)}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleOnChangeSelect(e)}
                className={s.Select}
            >
                {Object.keys(DateGranularity).map((date: string, index: number) => (
                    <option key={index} value={date}>
                        {date.charAt(0).toUpperCase() + date.slice(1)}
                    </option>
                ))}
            </select>
            <LineChart measures={result.definition.measures} trendBy={trendBy} />
        </div>
    );
};

export default GroupedDateDropdown;
