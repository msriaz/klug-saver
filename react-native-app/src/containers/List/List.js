import React from 'react';
import numeral from 'numeral';
import { View, StyleSheet, FlatList, Text, Button } from 'react-native';
import Swipeout from 'react-native-swipeout';

import { toddMMM } from '../../util';
import { PAGES } from '../../constants';
import { DeleteModal } from './DeleteModal';
import { categoryMap } from '../Categories/constants';

export default class List extends React.Component {
  static navigationOptions = {
    title: PAGES.LIST
  };

  state = {
    itemToDelete: null,
  };

  setItemToDelete = (item) => {
    this.setState({ itemToDelete: item });
  }

  render() {
    const { expenses } = this.props;
    return (
      <View style={styles.root}>
        <Button
          buttonStyle={styles.refreshButton}
          title="Refresh"
          icon={{ name: 'refresh' }}
          onPress={this.onRefresh}
        />
        {expenses && expenses.length && expenses.map && <FlatList
          styles={styles.container}
          data={expenses.map((e, i) => ({ ...e, key: i + '' }))}
          renderItem={this.renderItem}
        />}
        <DeleteModal
          item={this.state.itemToDelete}
          onCancel={this.closeDeletePopup}
          onOK={this.onDelete}
        />
      </View>
    );
  }

  renderItem = ({ item }) => {
    const swipeOutButtons = [
      {
        text: 'Delete',
        backgroundColor: '#E90F09',
        color: '#FFFFFF',
        onPress: this.onOpenDeletePopup(item)
      }
    ];

    const bgColor = categoryMap[item.category] ? categoryMap[item.category].color : 'transparent';

    return (
      <Swipeout
        right={swipeOutButtons}
        backgroundColor="#F1F5F5"
        autoClose={true}
      >
        <View style={styles.item}>
          <View style={[styles.rowColor, { backgroundColor: bgColor }]} />
          <Text style={styles.date}>{toddMMM(item.createdAt)}</Text>
          <Text style={styles.description}>{item.category} {item.subCategory}</Text>
          <Text style={styles.amount}>{numeral(item.amount || 0).format('0,0.00')}</Text>
        </View>
      </Swipeout>
    );
  };

  onRefresh = () => {
    this.props.getExpenses();
  }

  onOpenDeletePopup = (item) => () => {
    this.setItemToDelete(item);
  }

  onDelete = () => {
    this.props.removeExpense(this.state.itemToDelete.id);
    this.closeDeletePopup();
  }

  closeDeletePopup = () => {
    this.setItemToDelete(null);
  }
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: 40
  },
  container: {
    flex: 1,
    backgroundColor: '#D1EAEB',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingRight: 16
  },
  rowColor: {
    width: 8,
    marginRight: 10
  },
  amount: {
    fontWeight: 'bold',
    width: 60,
    color: '#003249',
    textAlign: 'right',
    fontFamily: 'lato-regular'
  },
  description: {
    flexGrow: 1,
    color: '#003249',
    fontFamily: 'lato-thin'
  },
  date: {
    width: 90,
    color: '#003249',
    fontFamily: 'lato-thin'
  },
  refreshButton: {
    backgroundColor: '#003249'
  }
});
