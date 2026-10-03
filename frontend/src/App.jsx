
import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!file) {
      setMessage('Please upload a screenshot first.')
      return
    }

    try {
      setLoading(true)
      setMessage('Uploading screenshot...')

      const formData = new FormData()
      formData.append('screenshot', file)

      const response = await fetch(
        'http://localhost:5000/api/analyze',
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setMessage(data.message)
    } catch (error) {
      setMessage(error.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">⌘</div>
          <h2>ErrorLens <span>AI</span></h2>
        </div>

        <div className="nav-tag">
          ✦ Powered by Gemma 4
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              AI-POWERED DEBUGGING ASSISTANT
            </div>

            <h1>
              Turn Error Screenshots
              <br />
              into <span>Clear Explanations.</span>
            </h1>

            <p className="description">
              Upload your programming error screenshot and let
              AI explain what went wrong, why it happened,
              and how to fix it — in simple terms.
            </p>

            <div className="languages">
              <span>☕ Java</span>
              <span>🐍 Python</span>
              <span>◈ C / C++</span>
              <span>and more...</span>
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-icon">↑</div>

            <h2>Upload Your Error Screenshot</h2>

            <p>
              Choose an image of your programming error
            </p>

            <small>
              PNG, JPG, JPEG · Maximum 5MB
            </small>

            <label className="upload-button">
              {file ? '✓ Screenshot Selected' : '↥ Choose File'}

              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const selectedFile = e.target.files[0]

                  if (!selectedFile) return

                  if (selectedFile.size > 5 * 1024 * 1024) {
                    setMessage('File must be smaller than 5MB.')
                    setFile(null)
                    return
                  }

                  setFile(selectedFile)
                  setMessage('')
                }}
                hidden
              />
            </label>

            {file && (
              <div className="file-name">
                {file.name}
              </div>
            )}

            <button
              className="upload-button"
              onClick={handleAnalyze}
              disabled={!file || loading}
            >
              {loading ? 'Uploading...' : 'Analyze Screenshot'}
            </button>

            {message && (
              <p role="status">
                {message}
              </p>
            )}
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-icon">ϟ</div>
            <div>
              <h3>Instant Analysis</h3>
              <p>Get quick, clear explanations</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">♧</div>
            <div>
              <h3>Beginner Friendly</h3>
              <p>No jargon, just simple language</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">⌘</div>
            <div>
              <h3>Helpful Fixes</h3>
              <p>Corrected code and next steps</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">♢</div>
            <div>
              <h3>Gemma 4 Powered</h3>
              <p>AI assistance for learners</p>
            </div>
          </div>
        </section>

        <section className="how-section">
          <h2>How It Works</h2>

          <div className="steps">
            <div className="step">
              <div className="step-icon">▧</div>
              <div>
                <h3>01. Upload Screenshot</h3>
                <p>Add your error message or problem image.</p>
              </div>
            </div>

            <div className="arrow">→</div>

            <div className="step">
              <div className="step-icon">✧</div>
              <div>
                <h3>02. AI Analysis</h3>
                <p>Gemma 4 analyzes the programming error.</p>
              </div>
            </div>

            <div className="arrow">→</div>

            <div className="step">
              <div className="step-icon">▤</div>
              <div>
                <h3>03. Get Explanation</h3>
                <p>Understand the cause, fix, and next steps.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        Built with ❤️ for learners · ErrorLens AI
      </footer>
    </div>
  )
}

export default App