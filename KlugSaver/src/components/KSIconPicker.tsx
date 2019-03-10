import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight, TextInput } from 'react-native';
import { KSModal } from './KSModal';
import { ICONS } from '../constants/icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IThemeConstants } from '../typings';


export interface IKSIconPickerProps {
  open: boolean;
  icon: string;
  close: (icon: string) => void;
}

interface IKSIconPickerState {
  searchText: string;
}

class KSIconPicker extends React.Component<IKSIconPickerProps, IKSIconPickerState, IThemeConstants> {
  constructor(props: IKSIconPickerProps) {
    super(props);

    this.state = {
      searchText: ''
    };
  }

  public render() {
    const { open, icon } = this.props;
    const { searchText } = this.state;
    const theme = this.context;
    const icons = this.getIcons();

    if (!open) {
      return null;
    }

    return (
      <KSModal
        open={open}
        title="Choose an Icon"
        close={this.pickIcon(icon)}
        containerStyle={styles(theme).modalContainerOverride}
      >
        <View style={styles(theme).container}>
          <View style={{ height: 60, flexDirection: 'row' }}>
            <TextInput
              style={styles(theme).buttonText}
              value={searchText}
              onChangeText={this.onSearchTextChange}
              keyboardAppearance="light"
              selectionColor={theme.textMainColor}
              placeholder="Search ..."
              placeholderTextColor={theme.textSecondaryColor}
            />
          </View>
          <FlatList
            data={icons}
            renderItem={this.renderItem}
            keyExtractor={item => item}
          />
        </View>
      </KSModal>
    );
  }

  private renderItem = ({ item }: { item: string }) => {
    const { icon } = this.props;
    const theme = this.context;
    const selectedStyle = icon === item && styles(theme).selected;

    return <TouchableHighlight key={item} onPress={this.pickIcon(item)}>
      <View style={[styles(theme).item, selectedStyle]}>
        <Icon name={item} size={20} color={theme.textMainColor} />
        <Text style={[styles(theme).itemNameText, selectedStyle]}>{item}</Text>
      </View>
    </TouchableHighlight>;
  }

  private pickIcon = (item: string) => () => {
    this.props.close(item);
    this.setState({ searchText: '' });
  }

  private onSearchTextChange = (searchText: string) => {
    this.setState({ searchText });
  }

  private getIcons = () => {
    const { searchText } = this.state;
    
    if (!searchText) {
      return ICONS;
    }

    const terms = searchText.trim().split(' ');

    return ICONS.filter(i => terms.every(t => i.indexOf(t.toLowerCase()) > -1));
  }
}

export default KSIconPicker;


const styles = (theme: IThemeConstants) => StyleSheet.create({
  modalContainerOverride: {
  },
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.underlayColor
  },
  selected: {
    backgroundColor: theme.accentMainColor,
    color: theme.accentTextColor
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 25
  },
  itemNameText: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: theme.fontThin,
    color: theme.textMainColor
  },
  buttonText: {
    color: theme.textSecondaryColor,
    flex: 1,
    height: 40,
    backgroundColor: theme.underlayColor,
    fontSize: 16,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 15
  }
});
