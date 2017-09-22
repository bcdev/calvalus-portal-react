import * as React from 'react';

export enum ListBoxSelectionMode {
    SINGLE,
    MULTIPLE
}

export interface ListBoxProps {
    numItems: number;
    renderItem: (itemIndex: number) => JSX.Element;
    getItemKey?: (itemIndex: number) => React.Key;
    onItemClick?: (key: React.Key, itemIndex: number) => void;
    onItemDoubleClick?: (key: React.Key, itemIndex: number) => void;
    onSelection?: (oldSelection: Array<React.Key> | undefined, newSelection: Array<React.Key>) => void;
    selectionMode?: ListBoxSelectionMode;
    selection?: Array<React.Key>;
    style?: Object;
    itemStyle?: Object;
    itemSelectedStyle?: Object;
}

export class ListBox extends React.Component<ListBoxProps, any> {
    constructor(props: ListBoxProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleClick(itemIndex: number, key: string | number) {
        if (this.props.onSelection) {
            const selectionMode = this.props.selectionMode || ListBoxSelectionMode.SINGLE;
            let newSelection;
            if (this.props.selection) {
                const selectedItemIndex = this.props.selection.findIndex(k => k === key);
                if (selectedItemIndex >= 0) {
                    newSelection = this.props.selection.slice();
                    newSelection.splice(selectedItemIndex, 1);
                } else {
                    if (selectionMode === ListBoxSelectionMode.SINGLE) {
                        newSelection = [key];
                    } else {
                        newSelection = this.props.selection.slice();
                        newSelection.push(key);
                    }
                }
            } else {
                newSelection = [key];
            }
            this.props.onSelection(this.props.selection, newSelection);
        }
        if (this.props.onItemClick) {
            this.props.onItemClick(key, itemIndex);
        }
    }

    handleDoubleClick(itemIndex: number, key: string | number) {
        if (this.props.onItemDoubleClick) {
            this.props.onItemDoubleClick(key, itemIndex);
        }
    }

    render() {
        // see http://www.w3schools.com/css/tryit.asp?filename=trycss_list-style-border
        const border = '1px solid #ddd';
        const listStyle = Object.assign(
            {
                listStyleType: 'none',
                padding: 0,
                border
            },
            this.props.style || {});
        const normalItemStyle = Object.assign(
            {
                padding: '0.4em',
                borderBottom: border,
            },
            this.props.itemStyle || {});
        const selectedItemStyle = Object.assign({}, normalItemStyle, this.props.itemSelectedStyle || {});

        const selection = new Set<any>(this.props.selection || []);
        const getItemKey = this.props.getItemKey || (itemIndex => itemIndex);
        const renderItem = this.props.renderItem;
        let items: Array<JSX.Element> = [];
        for (let itemIndex = 0; itemIndex < this.props.numItems; itemIndex++) {
            const key = getItemKey(itemIndex);
            const item = renderItem(itemIndex);
            const itemStyle = selection.has(key) ? selectedItemStyle : normalItemStyle;
            items.push(
                <li
                    key={key}
                    onClick={() => this.handleClick(itemIndex, key)}
                    onDoubleClick={() => this.handleDoubleClick(itemIndex, key)}
                    style={itemStyle}
                >
                    {item}
                </li>
            );
        }

        return (
            <ul style={listStyle}>
                {items}
            </ul>
        );
    }
}
