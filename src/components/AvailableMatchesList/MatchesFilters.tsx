import React, { useCallback, useState } from "react";
import { View, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomSearchInput from "@/src/components/ui/CustomSearchInput/CustomSearchInput";
import CustomDatePicker from "@/src/components/ui/CustomDatePicker/CustomDatePicker";
import CustomTimePicker from "@/src/components/ui/CustomTimePicker/CustomTimePicker";
import CustomSelect from "@/src/components/ui/CustomSelect/CustomSelect";
import { colors } from "@/src/theme";
import { styles } from "./MatchesFilters.styles";
import useGenders from "@/src/hooks/useGenders";
import useCategories from "@/src/hooks/useCategories";
import { DURATIONS } from "@/src/constants/match";
import { MatchFilters } from "@/src/types";
import { formatDate, formatTime } from "@/src/utils/common";
import { useFocusEffect } from "expo-router";

interface MatchesFiltersProps {
  onFiltersChange: (filters: MatchFilters) => void;
}

const MatchesFilters: React.FC<MatchesFiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState<string | null>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [timeFrom, setTimeFrom] = useState<Date | null>(null);
  const [timeTo, setTimeTo] = useState<Date | null>(null);
  const [gender, setGender] = useState<number | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [key, setKey] = useState<number>(0);

  const { data: genders = [], loading: loadingGenders } = useGenders();
  const { data: allCategories = [], loading: loadingCategories } =
    useCategories();

  // Filtrar categorías basadas en el género seleccionado
  const categories = gender
    ? allCategories.filter((cat) => cat.genderId === gender)
    : allCategories;

  useFocusEffect(
    useCallback(() => {
      setKey(Math.random());
    }, [])
  );

  const getActualFilters = (): MatchFilters => ({
    description: search,
    dateFrom: formatDate(dateFrom),
    dateTo: formatDate(dateTo),
    timeFrom: formatTime(timeFrom),
    timeTo: formatTime(timeTo),
    gender,
    category,
    duration,
    matchId: null,
  });

  const handleSearch = (searchTerm: string) => {
    const actualFilters = getActualFilters();
    actualFilters.description = searchTerm || null;

    setSearch(searchTerm || null);
    onFiltersChange(actualFilters);
  };

  const handleGenderChange = (value: number | null) => {
    // Verificar si la categoría actual está disponible para el nuevo género
    const newCategories = value
      ? allCategories.filter((cat) => cat.genderId === value)
      : allCategories;
    const isCategoryAvailable =
      category && newCategories.some((cat) => cat.id === category);

    // Solo resetear la categoría si no está disponible para el nuevo género
    const newCategory = isCategoryAvailable ? category : null;

    const actualFilters = getActualFilters();
    actualFilters.gender = value;
    actualFilters.category = newCategory;

    setGender(value);
    setCategory(newCategory);
    onFiltersChange(actualFilters);
  };

  const handleCategoryChange = (value: number | null) => {
    const actualFilters = getActualFilters();
    actualFilters.category = value;

    setCategory(value);
    onFiltersChange(actualFilters);
  };

  const handleDurationChange = (value: number | null) => {
    const actualFilters = getActualFilters();
    actualFilters.duration = value;

    setDuration(value);
    onFiltersChange(actualFilters);
  };

  const handleDateFromChange = (newDateFrom: Date | null) => {
    const actualFilters = getActualFilters();
    actualFilters.dateFrom = formatDate(newDateFrom);

    setDateFrom(newDateFrom);
    onFiltersChange(actualFilters);
  };

  const handleDateToChange = (newDateTo: Date | null) => {
    const actualFilters = getActualFilters();
    actualFilters.dateTo = formatDate(newDateTo);

    setDateTo(newDateTo);
    onFiltersChange(actualFilters);
  };

  const handleTimeFromChange = (newTimeFrom: Date | null) => {
    const actualFilters = getActualFilters();
    actualFilters.timeFrom = formatTime(newTimeFrom);

    setTimeFrom(newTimeFrom);
    onFiltersChange(actualFilters);
  };

  return (
    <View key={key}>
      <CustomSearchInput
        placeholder="Buscá un partido"
        startSearchingOn={3}
        onSearch={handleSearch}
        onClear={() => handleSearch("")}
      />
      <View style={styles.filtersRow}>
        <MaterialIcons
          name="filter-list"
          size={32}
          color={colors.primary}
          style={{ marginTop: 22 }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.filtersList}>
            <View style={styles.filterItem}>
              <CustomSelect
                label=""
                data={genders}
                value={gender}
                onSelect={handleGenderChange}
                keyExtractor={(item) => item.code}
                labelExtractor={(item) => item.name}
                placeholder={loadingGenders ? "Cargando..." : "Género"}
                disabled={loadingGenders}
                inputStyles={gender ? styles.selected : {}}
                withReset
              />
            </View>
            <View style={styles.filterItem}>
              <CustomSelect
                label=""
                data={categories}
                value={category}
                onSelect={handleCategoryChange}
                keyExtractor={(item) => item.code}
                labelExtractor={(item) => item.description}
                placeholder={loadingCategories ? "Cargando..." : "Categoría"}
                disabled={loadingCategories}
                inputStyles={category ? styles.selected : {}}
                withReset
              />
            </View>
            <View style={[styles.filterItem, { marginTop: 26 }]}>
              <CustomDatePicker
                date={dateFrom}
                onChange={handleDateFromChange}
                placeholder="Fecha desde"
                minimumDate={new Date()}
                inputStyles={dateFrom ? styles.selected : {}}
                neutralButtonLabel="Restablecer"
              />
            </View>
            <View style={[styles.filterItem, { marginTop: 26 }]}>
              <CustomDatePicker
                date={dateTo}
                onChange={handleDateToChange}
                placeholder="Fecha hasta"
                minimumDate={dateFrom || new Date()}
                inputStyles={dateTo ? styles.selected : {}}
                neutralButtonLabel="Restablecer"
              />
            </View>
            <View style={[styles.filterItem, { marginTop: 26 }]}>
              <CustomTimePicker
                time={timeFrom}
                onChange={handleTimeFromChange}
                placeholder="Hora"
                inputStyles={timeFrom ? styles.selected : {}}
                neutralButtonLabel="Restablecer"
              />
            </View>
            <View style={styles.filterItem}>
              <CustomSelect
                label=""
                data={DURATIONS}
                value={duration}
                onSelect={handleDurationChange}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.name}
                placeholder="Duración"
                inputStyles={duration ? styles.selected : {}}
                withReset
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default MatchesFilters;
