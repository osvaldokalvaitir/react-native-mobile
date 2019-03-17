import React, { Component } from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import api from '~/services/api';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import styles from './styles';

class Product extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          id: PropTypes.string,
        }),
      }),        
    }).isRequired,
    values: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      color: PropTypes.string,
      size: PropTypes.number,
    }).isRequired,
    errors: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      color: PropTypes.string,
      size: PropTypes.number,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { id } = this.props.navigation.state.params;

    if (id) {
      const response = await api.get(`/products/${id}`);
      // enviar o response.data para o mapPropsToValues
    }
  }

  deleteProduct = async () => {
    const { id } = this.props.navigation.state.params;
    const { navigate } = this.props.navigation;
    try {
      await api.delete(`/products/${id}`);
      navigate('Main');
    } catch (err) {
      alert(`Não foi possível excluir o produto. Erro: ${err}`);
    }
  };

  render() {
    const { handleSubmit, errors, values, handleChange, setFieldValue } = this.props;
    const { id } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <View style={styles.productContainer}>
          <View style={styles.productItem}>
            <TextInput
              style={styles.input}
              placeholder="Título"
              type="text"
              name="title"
              value={values.title}
              onChangeText={text => setFieldValue('title', text)}
            />
            {!!errors.title && <Text style={styles.productError}>{errors.title}</Text>}
          </View>
          <View style={styles.productItem}>
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              type="text"
              name="description"
              value={values.description}
              onChangeText={text => setFieldValue('description', text)}
            />
            {!!errors.description && <Text style={styles.productError}>{errors.description}</Text>}
          </View>
          <View style={styles.productItem}>
            <TextInput
              style={styles.input}
              placeholder="Cor"
              type="text"
              name="color"
              value={values.color}
              onChangeText={text => setFieldValue('color', text)}
            />
            {!!errors.color && <Text style={styles.productError}>{errors.color}</Text>}
          </View>
          <View style={styles.productItem}>
            <TextInput
              style={styles.input}
              placeholder="Tamanho"
              type="number"
              name="size"
              value={values.size}
              onChangeText={text => setFieldValue('size', text)}
              keyboardType = 'numeric'
            />
            {!!errors.size && <Text style={styles.productError}>{errors.size}</Text>}
          </View>

          <View className="actions">
            <TouchableOpacity style={styles.actionButton} type="submit" onPress={handleSubmit}>
              <Text style={styles.actionButtonText}>Salvar dados</Text>
            </TouchableOpacity>
            {id ? (
              <TouchableOpacity style={styles.actionButton} type="button" onPress={this.deleteProduct}>
                <Text style={styles.actionButtonText}>Excluir produto</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

export default withFormik({
  mapPropsToValues: () => ({
    title: '',
    description: '',
    color: '',
    size: 0,
  }),

  validateOnChange: false,
  validateOnBlur: false,

  validationSchema: Yup.object().shape({
    title: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    color: Yup.string().required('Campo obrigatório'),
    size: Yup.number().required('Campo obrigatório'),
  }),

  handleSubmit: async (values, { props }) => {
    const { id } = props.navigation.state.params;

    try {
      await api.postOrPut('products', id, values);
      props.navigation.navigate('Main');
    } catch (err) {
      alert(`Não foi possível salvar os dados. Erro: ${err}`);
    }
  },
})(Product);
