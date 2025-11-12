import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDropdown from './CustomDropdown';
import {
  countries,
  citiesByCountry,
  industries,
  rolesByIndustry,
  experienceLevels
} from '../data/mockData';
import {
  personalInfoSchema,
  locationSchema,
  professionalInfoSchema
} from '../utils/validation';

/**
 * CHALLENGE #2: Multi-Step Form with Dependent Dropdowns
 *
 * Issues with React Native Web:
 * 1. No native form submission (no <form> element)
 * 2. TextInput behavior differs web vs mobile
 * 3. Validation error display is manual
 * 4. Tab navigation doesn't work properly on web
 * 5. Autocomplete attributes don't work
 * 6. Browser form features (like password managers) don't work
 */

const JobApplicationForm = ({ onSubmit, onSaveDraft, initialData = {} }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryId: 0,
    cityId: 0,
    address: '',
    postalCode: '',
    industryId: 0,
    roleId: 0,
    experienceId: 0,
    expectedSalary: 0,
    ...initialData
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // Get the appropriate schema for current step
  const getStepSchema = () => {
    switch (step) {
      case 1: return personalInfoSchema;
      case 2: return locationSchema;
      case 3: return professionalInfoSchema;
      default: return personalInfoSchema;
    }
  };

  const { control, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
    resolver: zodResolver(getStepSchema()),
    mode: 'onChange',
    defaultValues: formData
  });

  // Watch for country changes to update cities
  const watchCountry = watch('countryId');
  const watchIndustry = watch('industryId');
  const watchRole = watch('roleId');
  const watchSalary = watch('expectedSalary');

  /**
   * CHALLENGE #3: Dependent Dropdown Logic
   *
   * This is complex because:
   * 1. Must manually track dependencies
   * 2. Need to reset dependent fields when parent changes
   * 3. Validation must be re-triggered
   * 4. State management becomes messy
   */
  useEffect(() => {
    if (watchCountry && watchCountry > 0) {
      const cities = citiesByCountry[watchCountry] || [];
      setAvailableCities(cities);

      // Reset city if country changed
      const currentCity = watch('cityId');
      const cityExists = cities.find(c => c.id === currentCity);
      if (!cityExists && currentCity !== 0) {
        setValue('cityId', 0);
      }
    } else {
      setAvailableCities([]);
      setValue('cityId', 0);
    }
  }, [watchCountry]);

  useEffect(() => {
    if (watchIndustry && watchIndustry > 0) {
      const roles = rolesByIndustry[watchIndustry] || [];
      setAvailableRoles(roles);

      // Reset role if industry changed
      const currentRole = watch('roleId');
      const roleExists = roles.find(r => r.id === currentRole);
      if (!roleExists && currentRole !== 0) {
        setValue('roleId', 0);
        setSelectedRole(null);
      }
    } else {
      setAvailableRoles([]);
      setValue('roleId', 0);
      setSelectedRole(null);
    }
  }, [watchIndustry]);

  useEffect(() => {
    if (watchRole && watchRole > 0) {
      const role = availableRoles.find(r => r.id === watchRole);
      setSelectedRole(role);
    } else {
      setSelectedRole(null);
    }
  }, [watchRole, availableRoles]);

  /**
   * CHALLENGE #4: Custom Salary Validation
   * Based on selected role's minimum salary
   */
  const salaryError = selectedRole && watchSalary && watchSalary < selectedRole.minSalary
    ? `Minimum salary for ${selectedRole.name} is $${selectedRole.minSalary.toLocaleString()}`
    : null;

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      // CHALLENGE: Alert on web is not ideal UX, but React Native doesn't have toast notifications
      if (Platform.OS === 'web') {
        alert('Please fix the errors before continuing');
      } else {
        Alert.alert('Validation Error', 'Please fix the errors before continuing');
      }
      return;
    }

    const currentValues = watch();
    setFormData({ ...formData, ...currentValues });
    setStep(step + 1);
  };

  const handlePrevious = () => {
    const currentValues = watch();
    setFormData({ ...formData, ...currentValues });
    setStep(step - 1);
  };

  const handleSaveDraft = () => {
    const currentValues = watch();
    const draftData = { ...formData, ...currentValues };
    onSaveDraft(draftData);
  };

  const handleFinalSubmit = async (data) => {
    if (salaryError) {
      if (Platform.OS === 'web') {
        alert(salaryError);
      } else {
        Alert.alert('Validation Error', salaryError);
      }
      return;
    }

    const finalData = { ...formData, ...data };
    onSubmit(finalData);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Application Form</Text>
        <Text style={styles.stepIndicator}>Step {step} of 3</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
      </View>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Personal Information</Text>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name *</Text>
                {/* CHALLENGE: TextInput on web doesn't support autocomplete properly */}
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter first name"
                  autoCapitalize="words"
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter last name"
                  autoCapitalize="words"
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                {/* CHALLENGE: keyboardType="email-address" doesn't do anything on web */}
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="+1 (555) 123-4567"
                  keyboardType="phone-pad"
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>
            )}
          />
        </View>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Location Details</Text>

          <Controller
            control={control}
            name="countryId"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Country *"
                value={value}
                options={countries}
                onSelect={onChange}
                error={errors.countryId?.message}
                placeholder="Select country"
              />
            )}
          />

          {/* CHALLENGE: Dependent dropdown - cities only available after country selected */}
          <Controller
            control={control}
            name="cityId"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="City *"
                value={value}
                options={availableCities}
                onSelect={onChange}
                error={errors.cityId?.message}
                placeholder={watchCountry ? "Select city" : "Select country first"}
                disabled={!watchCountry || availableCities.length === 0}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Street Address *</Text>
                {/* CHALLENGE: multiline TextInput has issues on web with height */}
                <TextInput
                  style={[styles.input, styles.textArea, errors.address && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter street address"
                  multiline
                  numberOfLines={3}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="postalCode"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Postal Code *</Text>
                <TextInput
                  style={[styles.input, errors.postalCode && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="12345"
                />
                {errors.postalCode && (
                  <Text style={styles.errorText}>{errors.postalCode.message}</Text>
                )}
              </View>
            )}
          />
        </View>
      )}

      {/* Step 3: Professional Information */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Professional Information</Text>

          <Controller
            control={control}
            name="industryId"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Industry *"
                value={value}
                options={industries}
                onSelect={onChange}
                error={errors.industryId?.message}
                placeholder="Select industry"
              />
            )}
          />

          {/* CHALLENGE: Another dependent dropdown - roles depend on industry */}
          <Controller
            control={control}
            name="roleId"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Job Role *"
                value={value}
                options={availableRoles}
                onSelect={onChange}
                error={errors.roleId?.message}
                placeholder={watchIndustry ? "Select role" : "Select industry first"}
                disabled={!watchIndustry || availableRoles.length === 0}
              />
            )}
          />

          {selectedRole && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Minimum salary for {selectedRole.name}: ${selectedRole.minSalary.toLocaleString()}
              </Text>
            </View>
          )}

          <Controller
            control={control}
            name="experienceId"
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Experience Level *"
                value={value}
                options={experienceLevels}
                onSelect={onChange}
                error={errors.experienceId?.message}
                placeholder="Select experience level"
              />
            )}
          />

          <Controller
            control={control}
            name="expectedSalary"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Expected Salary (USD) *</Text>
                {/* CHALLENGE: Number input on web vs mobile is different */}
                <TextInput
                  style={[styles.input, (errors.expectedSalary || salaryError) && styles.inputError]}
                  value={value ? value.toString() : ''}
                  onChangeText={(text) => {
                    const number = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                    onChange(number);
                  }}
                  placeholder="80000"
                  keyboardType="numeric"
                />
                {errors.expectedSalary && (
                  <Text style={styles.errorText}>{errors.expectedSalary.message}</Text>
                )}
                {salaryError && (
                  <Text style={styles.errorText}>{salaryError}</Text>
                )}
              </View>
            )}
          />
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevious}>
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.draftButton, step === 1 && styles.draftButtonFull]}
          onPress={handleSaveDraft}
        >
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>

        {step < 3 ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit(handleFinalSubmit)}
          >
            <Text style={styles.primaryButtonText}>Submit Application</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    // CHALLENGE: Transitions don't work consistently
    ...(Platform.OS === 'web' && {
      transition: 'width 0.3s ease',
    })
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    // CHALLENGE: Shadow styles again
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }
    })
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    // CHALLENGE: Outline on web needs custom handling
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    })
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#1976d2',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1976d2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  secondaryButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#757575',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    })
  },
  draftButtonFull: {
    flex: 2,
  },
  draftButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JobApplicationForm;
