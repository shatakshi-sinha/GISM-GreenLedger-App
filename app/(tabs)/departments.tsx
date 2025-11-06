import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  IconButton,
  Button,
  Modal,
  Portal,
  Provider,
  TextInput,
  Menu,
  Divider
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

interface Department {
  id: string;
  name: string;
  manager: string;
  emissionSources: string[];
  monthlyEmissions: number;
  trend: 'up' | 'down' | 'stable';
}

const initialDepartments: Department[] = [
  {
    id: "1",
    name: "Transport",
    manager: "Sarah Chen",
    emissionSources: ["Fleet Vehicles", "Business Travel", "Logistics"],
    monthlyEmissions: 5800,
    trend: "down"
  },
  {
    id: "2",
    name: "Energy",
    manager: "Mike Rodriguez",
    emissionSources: ["Electricity", "Natural Gas", "Generator"],
    monthlyEmissions: 6850,
    trend: "stable"
  },
  {
    id: "3",
    name: "Production",
    manager: "Emma Davis",
    emissionSources: ["Raw Materials", "Manufacturing", "Packaging"],
    monthlyEmissions: 3200,
    trend: "up"
  }
];

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    emissionSource: ''
  });

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'down': return Colors.success;
      case 'up': return Colors.error;
      case 'stable': return Colors.warning;
      default: return Colors.textTertiary;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'down': return 'trending-down';
      case 'up': return 'trending-up';
      case 'stable': return 'minus';
      default: return 'minus';
    }
  };

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim() || !newDepartment.manager.trim()) {
      Alert.alert('Error', 'Please fill in department name and manager');
      return;
    }

    const newDept: Department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      manager: newDepartment.manager,
      emissionSources: newDepartment.emissionSource ? [newDepartment.emissionSource] : [],
      monthlyEmissions: 0,
      trend: 'stable'
    };

    setDepartments([...departments, newDept]);
    setNewDepartment({ name: '', manager: '', emissionSource: '' });
    setModalVisible(false);
    Alert.alert('Success', 'Department added successfully!');
  };

  const handleDeleteDepartment = () => {
    setDepartments(prev => prev.filter(dept => dept.id !== selectedDepartment));
    setDeleteModalVisible(false);
    setMenuVisible('');
    Alert.alert('Success', 'Department deleted successfully!');
  };

  const openDeleteModal = (deptId: string) => {
    setSelectedDepartment(deptId);
    setDeleteModalVisible(true);
    setMenuVisible('');
  };

  const addEmissionSource = (deptId: string, source: string) => {
    if (!source.trim()) return;
    
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId 
        ? { ...dept, emissionSources: [...dept.emissionSources, source] }
        : dept
    ));
    setNewDepartment(prev => ({ ...prev, emissionSource: '' }));
  };

  const removeEmissionSource = (deptId: string, sourceIndex: number) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId 
        ? { 
            ...dept, 
            emissionSources: dept.emissionSources.filter((_, index) => index !== sourceIndex) 
          }
        : dept
    ));
  };

  return (
    <Provider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={styles.headerTitle}>Department Management</Title>
                <Paragraph style={styles.headerSubtitle}>
                  Monitor and manage emissions across all organizational departments
                </Paragraph>
              </View>
              <Button 
                mode="contained" 
                icon="plus"
                onPress={() => setModalVisible(true)}
              >
                Add Department
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Departments Grid */}
        {departments.map((department) => (
          <Card key={department.id} style={styles.departmentCard}>
            <Card.Content>
              <View style={styles.departmentHeader}>
                <View style={styles.departmentInfo}>
                  <Text style={styles.departmentName}>{department.name}</Text>
                  <Text style={styles.departmentManager}>Manager: {department.manager}</Text>
                </View>
                
                <View style={styles.departmentActions}>
                  <Chip 
                    icon={getTrendIcon(department.trend)}
                    mode="outlined"
                    style={[
                      styles.trendChip,
                      { borderColor: getTrendColor(department.trend) }
                    ]}
                    textStyle={{ color: getTrendColor(department.trend) }}
                  >
                    {department.trend === 'down' ? 'Decreasing' : 
                     department.trend === 'up' ? 'Increasing' : 'Stable'}
                  </Chip>
                  
                  <Menu
                    visible={menuVisible === department.id}
                    onDismiss={() => setMenuVisible('')}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => setMenuVisible(department.id)}
                      />
                    }
                  >
                    <Menu.Item 
                      leadingIcon="chart-box" 
                      onPress={() => Alert.alert('Analytics', `View analytics for ${department.name}`)} 
                      title="View Analytics" 
                    />
                    <Menu.Item 
                      leadingIcon="pencil" 
                      onPress={() => Alert.alert('Edit', `Edit ${department.name}`)} 
                      title="Edit Department" 
                    />
                    <Divider />
                    <Menu.Item 
                      leadingIcon="delete" 
                      onPress={() => openDeleteModal(department.id)} 
                      title="Delete" 
                      titleStyle={{ color: Colors.error }}
                    />
                  </Menu>
                </View>
              </View>

              {/* Emissions Info */}
              <View style={styles.emissionSection}>
                <Text style={styles.emissionLabel}>Monthly Emissions:</Text>
                <Text style={styles.emissionValue}>
                  {department.monthlyEmissions.toLocaleString()} kg CO₂e
                </Text>
              </View>

              {/* Emission Sources */}
              <View style={styles.sourcesSection}>
                <Text style={styles.sourcesLabel}>Emission Sources:</Text>
                <View style={styles.chipsContainer}>
                  {department.emissionSources.map((source, index) => (
                    <Chip 
                      key={index}
                      mode="outlined"
                      onClose={() => removeEmissionSource(department.id, index)}
                      style={styles.sourceChip}
                      textStyle={styles.sourceChipText}
                    >
                      {source}
                    </Chip>
                  ))}
                </View>
                
                {/* Add Source Input */}
                <View style={styles.addSourceContainer}>
                  <TextInput
                    placeholder="Add emission source..."
                    value={newDepartment.emissionSource}
                    onChangeText={(text) => setNewDepartment(prev => ({ ...prev, emissionSource: text }))}
                    style={styles.sourceInput}
                    mode="outlined"
                    dense
                  />
                  <Button 
                    mode="contained"
                    icon="plus"
                    onPress={() => addEmissionSource(department.id, newDepartment.emissionSource)}
                    style={styles.addSourceButton}
                    disabled={!newDepartment.emissionSource.trim()}
                  >
                    Add
                  </Button>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Button 
                  mode="outlined" 
                  icon="chart-bar"
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Reports', `Generate report for ${department.name}`)}
                >
                  Reports
                </Button>
                <Button 
                  mode="contained" 
                  icon="eye"
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Details', `View details for ${department.name}`)}
                >
                  View Details
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Empty State */}
        {departments.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton
                icon="office-building"
                size={48}
                iconColor={Colors.textTertiary}
                style={styles.emptyIcon}
              />
              <Title style={styles.emptyTitle}>No Departments</Title>
              <Paragraph style={styles.emptyText}>
                Start by creating your first department to organize emissions tracking.
              </Paragraph>
              <Button 
                mode="contained" 
                icon="plus"
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
              >
                Create First Department
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Add Department Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Add New Department</Title>
              
              <TextInput
                label="Department Name *"
                value={newDepartment.name}
                onChangeText={(text) => setNewDepartment(prev => ({ ...prev, name: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., Transportation, Production"
              />

              <TextInput
                label="Manager Name *"
                value={newDepartment.manager}
                onChangeText={(text) => setNewDepartment(prev => ({ ...prev, manager: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="Enter manager's name"
              />

              <TextInput
                label="Initial Emission Source"
                value={newDepartment.emissionSource}
                onChangeText={(text) => setNewDepartment(prev => ({ ...prev, emissionSource: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., Fleet Vehicles, Electricity"
              />

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleAddDepartment}
                  style={styles.modalButton}
                >
                  Create Department
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Delete Confirmation Modal */}
      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Delete Department</Title>
              <Paragraph style={styles.modalSubtitle}>
                Are you sure you want to delete "{departments.find(d => d.id === selectedDepartment)?.name}"?
                This action cannot be undone.
              </Paragraph>

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  buttonColor={Colors.error}
                  onPress={handleDeleteDepartment}
                  style={styles.modalButton}
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  departmentCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  departmentManager: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  departmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendChip: {
    height: 32,
    marginRight: 8,
  },
  emissionSection: {
    marginBottom: 16,
  },
  emissionLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emissionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sourcesSection: {
    marginBottom: 16,
  },
  sourcesLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sourceChip: {
    backgroundColor: Colors.surfaceVariant,
  },
  sourceChipText: {
    fontSize: 12,
  },
  addSourceContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sourceInput: {
    flex: 1,
  },
  addSourceButton: {
    minWidth: 80,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    margin: 0,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});