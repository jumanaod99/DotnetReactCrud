import { useForm } from "react-hook-form";
import PersonForm from "./PersonForm";
import PersonList from "./personList";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Person() {
  const BASE_URL = import.meta.env.VITE_BASE_API_URL + "/people";

  const defaultFormValues = {
    id: 0,
    firstName: "",
    lastName: "",
  };

  const [people, setPeople] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const methods = useForm({ defaultValues: defaultFormValues });

  useEffect(() => {
    if (editData) {
      methods.reset(editData);
    }
  }, [editData, methods]);

  useEffect(() => {
    const loadPeople = async () => {
      setLoading(true);
      try {
        const response = await axios.get(BASE_URL);
        setPeople(response.data);
      } catch {
        toast.error("Failed to fetch people list.");
      } finally {
        setLoading(false);
      }
    };

    loadPeople();
  }, []);

  const handlePersonEdit = (person) => {
    setEditData(person);
  };

  const handelFormReset = () => {
    setEditData(null);
    methods.reset(defaultFormValues);
  };

  // إضافة أو تعديل شخص عبر الـ API
  const handelFormSubmit = async (person) => {
    setLoading(true);
    try {
      if (person.id <= 0) {
        // إضافة شخص جديد (POST)
        const response = await axios.post(BASE_URL, person);
        setPeople((previousPerson) => [...previousPerson, response.data]);
        toast.success("Person added successfully!");
      } else {
        // تعديل شخص موجود (PUT)
        await axios.put(`${BASE_URL}/${person.id}`, person);
        setPeople((previousPerson) =>
          previousPerson.map((p) => (p.id === person.id ? person : p)),
        );
        toast.success("Person updated successfully!");
      }
    } catch {
      toast.error("Failed to save person data.");
    } finally {
      setLoading(false);
      handelFormReset();
    }
  };

  // حذف شخص عبر الـ API
  const handlePersonDelete = async (person) => {
    if (
      !confirm(
        `Are you sure to delete this person: ${person.firstName} ${person.lastName}?`,
      )
    )
      return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/${person.id}`);
      setPeople((previousPerson) =>
        previousPerson.filter((p) => p.id !== person.id),
      );
      toast.success("Person deleted successfully!");
    } catch {
      toast.error("Failed to delete person.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Person Management
          </h1>
        </div>

        <PersonForm
          methods={methods}
          onFormReset={handelFormReset}
          onFormSubmit={handelFormSubmit}
          loading={loading}
        />
        <PersonList
          peopleList={people}
          onPersonEdit={handlePersonEdit}
          onPersonDelete={handlePersonDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Person;
