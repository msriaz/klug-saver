import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import { IExpense, IThemeConstants } from '../../typings';
import { getRefreshDate } from '../../util';
import { KSButton } from '../../components';

export interface IDeleteModalProps {
  open: boolean;
  expense?: IExpense;
  onClose?: () => void;
  onDelete?: (id: string, from: Date) => void;
}

class DeleteModal extends React.Component<IDeleteModalProps, {}, IThemeConstants> {
  public render() {
    const { open, expense } = this.props;
    const theme = this.context;

    if (!expense) {
      return null;
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={open && !!expense}
        onRequestClose={this.onClose}
      >
        <View style={styles(theme).container}>
          <View style={styles(theme).labelContainer}>
            <Text style={styles(theme).messageText}>
              {expense.category} - {expense.subCategory}
            </Text>
          </View>
          <View style={styles(theme).labelContainer}>
            <Text style={styles(theme).messageText}>
              SGD {expense.amount}
            </Text>
          </View>

          <View style={styles(theme).buttons}>
            <KSButton
              text="Delete"
              onPress={this.onDelete}
            />
            <KSButton
              text="Cancel"
              onPress={this.onClose}
            />
          </View>
        </View>
      </Modal>
    );
  }

  private onDelete = () => {
    const { onDelete, expense, onClose } = this.props;

    if (expense && onDelete && onClose) {
      onDelete(expense.id, getRefreshDate());
      onClose();
    }
  }

  private onClose = () => {
    const { onClose: onClose } = this.props;

    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }
}

export default DeleteModal;

const styles = (theme: IThemeConstants) => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: theme.backgroundMainColor
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  messageText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    color: theme.textMainColor
  },
  buttons: {
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
  }
});
