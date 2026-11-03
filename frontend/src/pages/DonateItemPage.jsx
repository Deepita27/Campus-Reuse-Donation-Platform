import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Image,
  Link as LinkIcon,
  Layers
} from 'lucide-react';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DonateItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Books & Study Materials',
    condition: 'Good',
    description: '',
    pickupLocation: 'Central Library Front Entrance',
    customImageUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageMode, setImageMode] = useState('file'); // 'file' or 'url'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Books & Study Materials',
    'Electronics',
    'Stationery',
    'Clothing',
    'Lab Equipment',
    'Sports Equipment',
    'Furniture',
    'Others'
  ];

  const conditions = [
    { label: 'New', desc: 'Unopened, pristine condition' },
    { label: 'Like New', desc: 'Lightly used, perfect condition' },
    { label: 'Good', desc: 'Fully functional, normal signs of wear' },
    { label: 'Fair', desc: 'Usable, has visible marks or wear' }
  ];

  const sampleLocations = [
    'Central Library Front Entrance',
    'Main Cafeteria / Food Court',
    'Engineering Block B Lounge',
    'Campus Sports Complex Reception',
    'Student Affairs Center Foyer',
    'North Dormitory Common Room'
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size exceeds the 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile && !formData.customImageUrl) {
      setError('Please upload an image file or enter an image web URL for your item.');
      return;
    }

    setLoading(true);

    try {
      if (selectedFile) {
        const data = new FormData();
        data.append('itemName', formData.itemName);
        data.append('category', formData.category);
        data.append('condition', formData.condition);
        data.append('description', formData.description);
        data.append('pickupLocation', formData.pickupLocation);
        data.append('image', selectedFile);

        await itemService.createItem(data);
      } else {
        await itemService.createItem({
          itemName: formData.itemName,
          category: formData.category,
          condition: formData.condition,
          description: formData.description,
          pickupLocation: formData.pickupLocation,
          customImageUrl: formData.customImageUrl
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-donations');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to submit item for donation.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="badge-eco">Circular Sharing</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-campus-text tracking-tight">
          Donate an Unused Campus Item
        </h1>
        <p className="text-sm text-campus-textMuted max-w-xl">
          Pass along books, calculators, tools, or supplies to fellow students who need them. Your
          listing will be reviewed by campus administration before appearing in the marketplace.
        </p>
      </div>

      {success ? (
        <div className="campus-card p-12 text-center bg-white space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-campus-text">Donation Submitted!</h2>
          <p className="text-sm text-campus-textMuted max-w-md mx-auto">
            Your item listing has been registered with status{' '}
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Pending Review</span>.
            Once approved by administration, it will be visible in the campus marketplace.
          </p>
          <span className="text-xs text-campus-primary font-bold block pt-2">
            Redirecting to My Donations...
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="campus-card p-6 sm:p-8 bg-white space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
              Item Title / Name *
            </label>
            <input
              type="text"
              name="itemName"
              required
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="e.g. Texas Instruments TI-84 Plus CE Calculator"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary font-medium"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary bg-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary bg-white font-medium"
              >
                {conditions.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label} ({c.desc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted">
                Description *
              </label>
              <span className="text-xs text-campus-textMuted">
                {formData.description.length}/2000
              </span>
            </div>
            <textarea
              name="description"
              required
              rows={4}
              maxLength={2000}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item's condition, whether it includes accessories, which semester or course it was used for..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary resize-none font-medium"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted">
                Item Image *
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    imageMode === 'file'
                      ? 'bg-campus-primary text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    imageMode === 'url'
                      ? 'bg-campus-primary text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Web Image URL
                </button>
              </div>
            </div>

            {imageMode === 'file' ? (
              <div className="border-2 border-dashed border-gray-200 hover:border-campus-primary/60 rounded-2xl p-6 text-center transition bg-campus-bg/50">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover mx-auto rounded-xl shadow-md border"
                    />
                    <label className="inline-block px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-lg cursor-pointer">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <div className="w-12 h-12 bg-campus-secondary text-campus-primary rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-campus-text">
                      Click to upload item photograph
                    </p>
                    <p className="text-xs text-campus-textMuted">
                      PNG, JPG, or WebP up to 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    name="customImageUrl"
                    value={formData.customImageUrl}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-campus-primary"
                  />
                </div>
                {formData.customImageUrl && (
                  <img
                    src={formData.customImageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Campus Pickup Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-campus-textMuted mb-1.5">
              Campus Pickup Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-campus-primary absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="pickupLocation"
                required
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="e.g. Central Library Front Entrance, Bench 2"
                className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-campus-primary/20 focus:border-campus-primary font-medium"
              />
            </div>

            {/* Quick location chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-campus-textMuted font-medium">Suggestions:</span>
              {sampleLocations.slice(0, 3).map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setFormData({ ...formData, pickupLocation: loc })}
                  className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md transition"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Donor details card */}
          <div className="p-4 bg-campus-bg rounded-2xl border border-campus-border flex items-center justify-between text-xs text-campus-textMuted">
            <div>
              <span className="font-bold text-campus-text block">Donor: {user?.name}</span>
              <span>{user?.department} • {user?.email}</span>
            </div>
            <span className="badge-eco">Verified Student</span>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-campus-primary hover:bg-campus-primaryDark text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-campus-accent" />
              <span>{loading ? 'Submitting Item...' : 'Submit Donation Listing'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DonateItemPage;
