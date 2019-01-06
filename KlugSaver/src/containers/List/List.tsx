import React from 'react';
import { View, StyleSheet, Button, SectionList } from 'react-native';

import { IExpense } from '../../typings';
import { getTheme } from '../../theme/utils';
import { toddMMMForHumans } from '../../util';
import SectionHeader from './Components/SectionHeader';
import ExpenseRow from './Components/ExpenseRow';

export interface IListProps {
  expenses: IExpense[];
  getExpenses: (args?: any) => any;
}

export default class List extends React.Component<IListProps, {}> {
  public render() {
    return (
      <View style={styles.rootView}>
        <Button
          title="Refresh"
          onPress={this.onRefresh}
        />
        {this.renderList()}
      </View>
    );
  }

  private renderList = () => {
    const sections = this.getExpenseSections();

    return <SectionList
      sections={sections}
      renderSectionHeader={this.renderHeader}
      renderItem={this.renderExpense}
      keyExtractor={(item, index) => item + index}
    />;
  }

  private getExpenseSections = () => {
    const { expenses } = this.props;
    const results: { [key: string]: IExpense[] } = {};

    expenses.forEach((e: IExpense) => {
      const formattedDate = toddMMMForHumans(e.createdAt);
      results[formattedDate] = [...results[formattedDate] || [], e];
    });

    return Object.keys(results).map((title: string) => ({
      title,
      data: results[title]
    }));
  }

  private renderHeader = (props: any) => <SectionHeader {...props} />;

  private renderExpense = (props: { item: IExpense }) => <ExpenseRow {...props} />

  getRefreshDate = () => {
    const dateOffset = (24 * 60 * 60 * 1000) * 30; // 30 days
    const from = new Date();

    from.setTime(from.getTime() - dateOffset);

    return from;
  }

  onRefresh = () => {
    this.props.getExpenses({ from: this.getRefreshDate() });
  }
}

const styles = StyleSheet.create({
  rootView: {
    paddingBottom: 40
  },
  containerView: {
    flex: 1,
    backgroundColor: getTheme().backgroundMain,
  },
  refreshButton: {
    backgroundColor: '#003249'
  }
});