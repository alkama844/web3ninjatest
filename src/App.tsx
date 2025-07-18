import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Server, Globe, Code, Zap, Shield, Mail } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  template_id: 'default' | 'contact' | 'inquiry' | 'support';
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  submissionId?: string;
  messageId?: string;
  processingTime?: number;
  timestamp?: string;
  details?: any;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    template_id: 'default'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  // Get the current WebContainer API URL
  const getApiUrl = () => {
    // Use the new Render API URL - this will serve both frontend and backend
    return 'https://web3ninja.onrender.com';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      const apiUrl = `${getApiUrl()}/submit-form`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();
      setResponse(data);

      if (data.success) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
          company: '',
          template_id: 'default'
        });
      }
    } catch (error) {
      setResponse({
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const testConnection = async () => {
    try {
      const apiUrl = `${getApiUrl()}/`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setResponse({
        success: true,
        message: `API Status: ${data.status} - ${data.message} (v${data.version}) - Endpoints: ${Object.keys(data.endpoints).join(', ')}`,
      });
    } catch (error) {
      setResponse({
        success: false,
        error: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const testGmail = async () => {
    try {
      const apiUrl = `${getApiUrl()}/test-gmail`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        setResponse({
          success: true,
          message: `Gmail API Test: ${data.message} - Email: ${data.data.emailAddress}`,
        });
      } else {
        setResponse({
          success: false,
          error: `Gmail API Error: ${data.error}`,
          hint: data.hint + ' Visit /gmail-setup for detailed instructions.',
        });
      }
    } catch (error) {
      setResponse({
        success: false,
        error: `Gmail test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Server className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Express.js Form Backend
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Production-ready form submission API with Gmail integration, security features, and beautiful email templates
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={testConnection}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Test API Status
            </button>
            <button
              onClick={() => window.open(`${getApiUrl()}/gmail-auth-select`, '_blank')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Choose Gmail Account
            </button>
            <button
              onClick={testGmail}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Test Gmail API
            </button>
            <button
              onClick={() => window.open(`${getApiUrl()}/home`, '_blank')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Live Demo
            </button>
            <button
              onClick={() => window.open(`${getApiUrl()}/form-to`, '_blank')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Form-To Demo
            </button>
            <button
              onClick={() => window.open(`${getApiUrl()}/form-to`, '_blank')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Form-To Demo
            </button>
            <div className="px-8 py-4 bg-white/80 backdrop-blur-sm rounded-xl text-sm text-blue-800 font-mono border border-blue-200 shadow-md flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Live API: {getApiUrl()}
            </div>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Security & Rate Limiting
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Gmail API Integration
            </div>
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-700 border border-gray-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-600" />
              RESTful API
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Submit Form</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Template
                </label>
                <select
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="default">Default Template</option>
                  <option value="contact">Contact Form</option>
                  <option value="inquiry">Business Inquiry</option>
                  <option value="support">Support Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">API Response</h2>
            </div>
            
            {response ? (
              <div className={`p-6 rounded-xl border-l-4 animate-in slide-in-from-right duration-300 ${
                response.success 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  {response.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 animate-in zoom-in duration-300" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 animate-in zoom-in duration-300" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    response.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {response.success ? 'Success!' : 'Error'}
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  {response.message && (
                    <p className={response.success ? 'text-green-700' : 'text-red-700'}>
                      <strong>Message:</strong> {response.message}
                    </p>
                  )}
                  {response.error && (
                    <p className="text-red-700">
                      <strong>Error:</strong> {response.error}
                    </p>
                  )}
                  {response.hint && (
                    <p className="text-amber-700 bg-amber-50 p-2 rounded">
                      <strong>💡 Hint:</strong> {response.hint}
                    </p>
                  )}
                  {response.submissionId && (
                    <p className="text-green-700">
                      <strong>Submission ID:</strong> {response.submissionId}
                    </p>
                  )}
                  {response.totalSent !== undefined && (
                    <p className="text-green-700">
                      <strong>Emails Sent:</strong> {response.totalSent} successful
                    </p>
                  )}
                  {response.totalFailed !== undefined && response.totalFailed > 0 && (
                    <p className="text-red-700">
                      <strong>Failed Emails:</strong> {response.totalFailed}
                    </p>
                  )}
                  {response.processingTime && (
                    <p className="text-green-700">
                      <strong>Processing Time:</strong> {response.processingTime}ms
                    </p>
                  )}
                  {response.timestamp && (
                    <p className="text-gray-600">
                      <strong>Timestamp:</strong> {new Date(response.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>

                {response.emailResults && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Email Results:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {response.emailResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-xs ${
                            result.success
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{result.envKey}</span>
                            <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                              {result.success ? '✅ Success' : '❌ Failed'}
                            </span>
                          </div>
                          <div className="text-gray-600 mt-1">
                            {result.email}
                          </div>
                          {result.messageId && (
                            <div className="text-gray-500 mt-1">
                              ID: {result.messageId}
                            </div>
                          )}
                          {result.error && (
                            <div className="text-red-600 mt-1">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {response.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                      View Details
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(response.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg mb-6">Submit the form to see the API response here</p>
                <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl text-sm text-blue-700 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    <p className="font-semibold">Setup Required:</p>
                  </div>
                  <p className="mb-2">To send emails, configure your Gmail API credentials and email recipients (TO_EMAIL, TO_EMAIL1-TO_EMAIL10) in the server/.env file</p>
                  <p className="text-blue-600">See USERGUIDE.md for detailed setup instructions</p>
                </div>
              </div>
            )}

            {/* API Usage Instructions */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Using this API from another site:</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Root/Status:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/</code></p>
                <p><strong>Health:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/health</code></p>
                <p><strong>Endpoint:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/submit-form</code></p>
                <p><strong>Live Demo:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/home</code></p>
                <p><strong>Form-To:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/form-to</code></p>
                <p><strong>Form-To:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/form-to</code></p>
                <p><strong>Gmail Setup:</strong> <code className="bg-white px-2 py-1 rounded">{getApiUrl()}/gmail-setup</code></p>
                <p><strong>Method:</strong> POST</p>
                <p><strong>Content-Type:</strong> application/json</p>
                <p><strong>Required fields:</strong> name, email, subject, message</p>
                <p><strong>Optional fields:</strong> phone, company, template_id</p>
                <p><strong>📧 Recipients:</strong> Supports up to 11 email addresses (TO_EMAIL + TO_EMAIL1-TO_EMAIL10)</p>
                <p><strong>⚠️ Note:</strong> Gmail API must be configured for email sending to work</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => window.open(`${getApiUrl()}/home`, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  🏠 Live Demo
                </button>
                <button
                  onClick={() => window.open(`${getApiUrl()}/gmail-setup`, '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  📚 Gmail Setup
                </button>
                <button
                  onClick={() => window.open(`${getApiUrl()}/status`, '_blank')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  ⚡ API Status
                </button>
                <button
                  onClick={() => window.open(`${getApiUrl()}/nafij`, '_blank')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  👨‍💻 About Developer
                </button>
                <button
                  onClick={() => window.open(`${getApiUrl()}/form-to`, '_blank')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  📧 Form-To Demo
                </button>
                <button
                  onClick={() => window.open(`${getApiUrl()}/form-to`, '_blank')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  📧 Form-To Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Integration Examples</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                JavaScript/Fetch (Standard Form)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-x-auto border border-gray-700 shadow-inner">
{`fetch('${getApiUrl()}/submit-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'Test message',
    template_id: 'contact'
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                JavaScript/Fetch (Form-To)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-x-auto border border-gray-700 shadow-inner">
{`fetch('${getApiUrl()}/form-to', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Custom Destinations',
    message: 'Send to multiple emails',
    FROM_TO1: 'recipient1@example.com',
    FROM_TO2: 'recipient2@example.com',
    template_id: 'contact'
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
              </pre>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                cURL (Standard Form)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-x-auto border border-gray-700 shadow-inner">
{`curl -X POST ${getApiUrl()}/submit-form \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "Test message",
    "template_id": "contact"
  }'`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                cURL (Form-To)
              </h3>
              <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-x-auto border border-gray-700 shadow-inner">
{`curl -X POST ${getApiUrl()}/form-to \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Custom Destinations",
    "message": "Send to multiple emails",
    "FROM_TO1": "recipient1@example.com",
    "FROM_TO2": "recipient2@example.com",
    "FROM_TO3": "recipient3@example.com"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;