import React from 'react';
import { StyleSheet } from 'react-native';
import { THEME_COLORS } from '~/utils/constants';
import { Slider as DefaultSlider } from 'react-native-elements';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 16,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: '#2bda8e'
  },
  track: { height: 6, borderRadius: 6 }
});

const Wrapper = styled.View`
  flex: 1;
  align-items: stretch;
`;

const Small = styled.Text`
  color: #2bda8e;
  font-size: 14;
`;

const Slider = ({
  minimum, maximum, value, valueText, onChange
}) => (
  <Wrapper>
    <DefaultSlider
      minimumValue={minimum}
      maximumValue={maximum}
      step={1}
      thumbStyle={styles.thumb}
      trackStyle={styles.track}
      minimumTrackTintColor={THEME_COLORS.SECONDARY}
      maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
      value={value}
      onValueChange={onChange}
    />
    <Small>
      {value} {valueText}
    </Small>
  </Wrapper>
);

Slider.propTypes = {
  minimum: PropTypes.number.isRequired,
  maximum: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  valueText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Slider;
